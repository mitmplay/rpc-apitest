import { writable, get } from 'svelte/store';
const json = {
  req: {},
  options: {
    showSrc: false,
    autoParsed: false,
  }
}
export const reqs = writable(json);

export async function init() {
  const req1 = await window.RPC.api.requests(true)
  const req2 = {}
  reqs.update(json => {
    for (const nspace in req1) {
      req2[nspace] = json.req[nspace] || req1[nspace]
    }
    json.req = req2
    return json
  })
  return req2
}

function syncStor(sec, run, xhr, ori, src) {
  if (/_template_/.test(run)) {
    if (typeof xhr.select==='object' && xhr.select!==null) {
      sec._slcs = Object.keys(xhr.select)
    } else {
      delete sec._slcs
    }
  } else {
    if (typeof ori.runs==='object' && ori.runs!==null) {
      sec._runs = Object.keys(ori.runs)
    } else {
      sec._runs = []
    }
  }
  sec.request = xhr
  sec.ori     = ori
  sec.src     = src
}

//# opt.slc is an object for uniq adding 
//# will translate to array before rpc call
async function requestEnv(sec, opt) {
  if (/_template_/.test(sec?._template_?.run)) {
    if (sec._template_._slc) {
      sec._template_._slc.forEach(x => opt.slc[x]=true)
    }
  }
  for (const id in sec) {
    const {run} = sec[id]
    if (run===undefined && typeof sec[id]==='object' && sec[id]!==null) {
      await requestEnv(sec[id], opt)
    } else if (sec[id].request) {
      const {env} = opt
      const slc = Object.keys(opt.slc)
      const [xhr, ori, src] = await RPC.api.request(run, {env, slc})
      syncStor(sec[id], run, xhr, ori, src)
    }
  }
}

export function changeEnv(ns, env) {
  const sec = get(reqs).req[ns]
  const {_template_} = sec
  if (_template_._env!==env) {
    _template_._env = env
  } else {
    delete _template_._env
    env = false
  }
  setTimeout(async ()=>{
    const slc = {}
    await requestEnv(sec, env ? {env, slc} : {slc})
    reqs.update(json => {
      json.req[ns] = sec
      return json
    })
  })
}

export function changeSlc(req, ns, sec, slc) {
  if (sec._slc!==slc) {
    sec._slc = slc
  } else {
    delete sec._slc
    slc = false
  }
  setTimeout(async ()=>{
    const slc = {}
    let sec2 = req[ns]
    const {_env:env} = sec2._template_
    sec.run.split('/').slice(1,-1).forEach(k=>{
      sec2 = sec2[k]
      if (sec2._template_._slc) {
        sec2._template_._slc.forEach(x => slc[x]=true)
      }
    })
    await requestEnv(sec2, {env, slc})
    reqs.update(json => {
      json.req[ns] = req[ns]
      return json
    })
  })
}

export function changeRun(req, ns, sec, _run) {
  if (sec._run!==_run) {
    sec._run = _run
  } else {
    delete sec._run
    _run = false
  }
  setTimeout(async ()=>{
    let sec2 = req[ns]
    const {_env:env} = sec2._template_
    const opt = {env}

    // get the last slc
    sec.run.split('/').slice(1).forEach(k=>{
      sec2 = sec2[k]
      if (sec2?._template_?._slc) {
        opt.slc = sec2?._template_?._slc
      }
    })

    if (sec2._run) {
      opt.run = sec2._run
    }

    const [xhr, ori, src] = await RPC.api.request(sec.run, opt)
    syncStor(sec, _run, xhr, ori, src)
    reqs.update(json => {
      json.req[ns] = req[ns]
      return json
    })
  })
}

async function _request(path, rpc=true) {
  let json = get(reqs)
  let {req} = json
  const apath = path.split('/')
  const file = apath.pop()
  const [ns,...slcs] = apath

  req = req[ns]
  const env = req?._template_?._env
  const opt = env ? {env} : {}
  for (const id of slcs) {
    req = req[id]
    const slc = req?._template_?._slc
    slc && (opt.slc = slc)
  }
  if (rpc || req[file]?._openName) {
    return await RPC.api.request(path, opt)
  } else if (!req[file]) {
    req[file] = { run: path}
    reqs.update(x => {
      return json
    })
    return []
  } else {
    delete req[file].request
    delete req[file].ori
    delete req[file].src
    return []
  }
}

export async function updateReq(path, opt={}) {
  if (opt.del) {
    reqs.update(json => {
      let {req} = json
      const folders = path.split('/')
      const file = folders.pop().replace(/\.yaml$/, '')
      for (const folder of folders) {
        req = req[folder] || {}
      }
      if (req[file]) {
        delete req[file]
      }
      return json
    })
    return
  }

  const [xhr, ori, src] = await _request(path, false) // if it came from broadcast
  if (!xhr) {
    return
  }

  reqs.update(json => {
    let {req} = json
    const folders = path.split('/')
    const file = folders.pop()
    for (const folder of folders) {
      req = req[folder] || {}
    }
    const sec = req[file] 
    syncStor(sec, sec.run, xhr, ori, src)
    return json
  })
}

export function clickSummary(evn, req, ns, json) {
  const el = evn.currentTarget.parentElement
  setTimeout(async _1 => {
    const {nspace,name} = el.dataset
    const sec = json[nspace]
    if (sec.run && !sec.request) {
      const [xhr, ori, src] = await _request(sec.run)
      syncStor(sec, sec.run, xhr, ori, src)
    } else if (sec._template_) {
      const {_template_: tpl} = sec
      if (!tpl.ori) {
        const [xhr, ori, src] = await _request(tpl.run)
        syncStor(tpl, tpl.run, xhr, ori, src)
      }
    }
    for (const key in json[nspace]) {
      const sec = json[nspace][key]
      if (!sec._runs && sec.run) {
        if (!sec._runs && !/_template_/.test(sec.run)) {
          const [xhr, ori, src] = await _request(sec.run, false)
          if (!xhr) {
            continue
          }
          syncStor(sec, sec.run, xhr, ori, src)
        }
      }
    }
    const root = ns || nspace
    reqs.update(_2 => {
      const open = (typeof el.getAttribute('open')==='string')
      json[nspace][name]= open
      _2.req[root] = req[root]
      return _2
    });
  })
}

function collapse(_reqs_) {
  for (const key in _reqs_) {
    const req = _reqs_[key]
    if (req.request) {
      delete req.request
      // delete req._runs
      delete req.ori
      delete req.src
    }
    if (!/^_[a-zA-Z0-9.-]+$/.test(key)) {
      req._openName = false
      if (!req.run) {
        collapse(req) 
      }  
    }
  }
}

export function clickCollapse(evn) {
  setTimeout(_ => {
    reqs.update(json => {
      collapse(json.req)
      return json
    })
  })
}

export function autoParsed({currentTarget}) {
  clickTogle(currentTarget, 'autoParsed')
}

export function showSrc({currentTarget}) {
  clickTogle(currentTarget, 'showSrc')
}

function clickTogle(el, key) {
  setTimeout(_ => {
    reqs.update(json => {
      json.options[key] = !el.checked
      if (!el.checked) {
        if (key==='showSrc' && !el.checked) {
          json.options.autoParsed = false
        } else {
          json.options.showSrc = false
        }
      }
      return json
    })
  })
}