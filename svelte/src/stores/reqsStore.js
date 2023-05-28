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
    } else { //# why need to delete?
      delete sec._slcs
      sec._slc = ''
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

async function requestEnv(sec, opt) {
  if (/_template_/.test(sec?._template_?.run)) {
    if (sec._template_._slc) {
      opt.slc = sec._template_._slc
    }
  }
  for (const id in sec) {
    const {run} = sec[id]
    if (run===undefined && typeof sec[id]==='object' && sec[id]!==null) {
      await requestEnv(sec[id], opt)
    } else if (sec[id].request) {
      const [xhr, ori, src] = await RPC.api.request(run, opt)
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
    await requestEnv(sec, env ? {env} : {})
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
    let sec2 = req[ns]
    const {_env:env} = sec2._template_
    sec.run.split('/').slice(1,-1).forEach(k=>sec2 = sec2[k])

    await requestEnv(sec2, slc ? {env, slc} : {env})
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

async function _request(path) {
  let {req} = get(reqs)
  const [ns,...slcs] = path.split('/').slice(0,-1)

  req = req[ns]
  const env = req?._template_?._env
  const opt = env ? {env} : {}
  for (const id of slcs) {
    req = req[id]
    const slc = req?._template_?._slc
    slc && (opt.slc = slc)
  }
  return await RPC.api.request(path, opt)
}

export async function updateReq(path, o) {
  const [xhr, ori, src] = o || await _request(path) // if it came from broadcast

  reqs.update(json => {
    let {req} = json
    const folders = path.split('/')
    const file = folders.pop()
    for (const folder of folders) {
      req = req[folder] || {}
    }
    const sec = req[file] 
    if (sec) {
      if (!o) {
        sec.request = xhr
        sec.ori     = ori
        sec.src     = src  
      } else {
        syncStor(sec, path, xhr, ori, src)
      }
    }
    return json
  })
}

export function clickSummary(evn, req, ns, json) {
  const el = evn.currentTarget.parentElement
  setTimeout(async _1 => {
    const {nspace,name} = el.dataset
    const {run, request} = json[nspace]
    if (run && !request) {
      const [xhr, ori, src] = await _request(run)
      json[nspace].request = xhr
      json[nspace].ori     = ori
      json[nspace].src     = src
    } else if (json[nspace]._template_) {
      const {_template_} = json[nspace]
      if (!_template_.ori) {
        const [xhr, ori, src] = await _request(_template_.run)
        syncStor(_template_, _template_.run, xhr, ori, src)
      }
    }
    for (const key in json[nspace]) {
      const sec = json[nspace][key]
      if (!sec._runs && sec.run) {
        if (!sec._runs && !/_template_/.test(sec.run)) {
          const [xhr, ori, src] = await _request(sec.run)
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