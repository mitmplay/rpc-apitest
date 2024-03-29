import { writable, get } from 'svelte/store';
const json = {
  req: {},
  options: {
    autoParsed: true,
    showHidden: false,
    showSource: false,
  }
}
export const reqs = writable(json);

export async function init() {
  const req1 = await window.RPC.api.requests(true)
  const req2 = {}
  reqs.update(json => {
    window.stores.req = json
    for (const nspace in req1) {
      req2[nspace] = json.req[nspace] || req1[nspace]
    }
    json.req = req2
    return json
  })
  return req2
}

function syncStor(req, path, xhr, ori, src) {
  if (/_template_/.test(path)) {
    if (typeof xhr.select==='object' && xhr.select!==null) {
      req._slcs = Object.keys(xhr.select)
    } else {
      delete req._slcs
    }
  } else {
    if (typeof ori.runs==='object' && ori.runs!==null) {
      req._runs = Object.keys(ori.runs)
    } else {
      req._runs = []
    }
  }
  req.request = xhr
  req.ori     = ori
  req.src     = src
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
      const slc = Object.keys(opt.slc) // slc translate to array
      const opt2 = {...opt, slc, var: true} // before rpc call
      const [xhr, ori, src] = await RPC.api.request(run, opt2)
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
      if (sec2?._template_?._slc) {
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
    sec._run = []
    _run = []
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

    if (sec2._run.length) {
      opt.run = sec2._run
    }
    opt.var = true
    const [xhr, ori, src] = await RPC.api.request(sec.run, opt)
    syncStor(sec, sec.run, xhr, ori, src)
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
  if (RPC._obj_.argv.verbose && req===undefined) {
    console.log('UNDIFINED!', ns)
  }
  const env = req?._template_?._env
  const opt = env ? {env} : {}
  for (const id of slcs) {
    req = req[id]
    const slc = req?._template_?._slc
    slc && (opt.slc = slc)
  }
  if (rpc || req[file]?._openName) {
    opt.var = true
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

async function updateState(path) {
  const {req} = get(reqs)
  const [ns, ...arr] = path.split('/')
  const file = arr.pop()
  let xreq = req[ns]
  let opt = {}
  if (arr.length===0) {
    const env = xreq?._template_?._env
    env && (opt.env = env)
  } 
  for (const id of arr) {
    xreq = xreq[id]
    const slc = xreq?._template_?._slc
    slc && (opt.slc = slc)
  }
  const [xhr, ori, src] = await RPC.api.request(path, opt) // if it came from broadcast
  if (!xhr) {
    return
  }
  syncStor(xreq[file], path, xhr, ori, src)
  if (path.includes('_template_')) {
    collapse(xreq, true) 
    if (arr.length===0) {
      // Update envs
      console.log('UPDATE _envs', path)
      const envs = Object.keys(xhr?.env || {})
      const root = xreq[file]
      root._envs = envs
      if (!envs.length || !envs.includes(root._env)) {
        console.log('DELETE _env')
        delete root._env
      }
    }  
  }

  reqs.update(json => {
    json.req[ns] = req[ns]
    return json
  })
}

export async function updateReq(path, opt={}) {
  if (['add', 'chg', 'del'].includes(opt._act)) {
    reqs.update(json => {
      let {req} = json
      const folders = path.split('/')
      const file = folders.pop().replace(/\.yaml$/, '')
      for (const folder of folders) {
        req = req[folder] || {}
      }
      if (opt._act==='del') {
        delete req[file]
      }  else {
        const run = path.replace(/\.yaml$/, '')
        req[file] = {run}
      }
      return json
    })
    return

  }
  await updateState(path)
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

function collapse(_reqs_, all=false) {
  for (const key in _reqs_) {
    const req = _reqs_[key]
    if (req!==null && typeof req==='object') {
      if (req.request) {
        delete req.request
        // delete req._runs
        delete req.ori
        delete req.src
        if (all) {
          req._slc && (req._slc = [])
          req._run && (req._run = [])
        }
      }
      if (!/^_[a-zA-Z0-9.-]+$/.test(key)) {
        req._openName = false
        if (!req.run) {
          collapse(req) 
        }  
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

export function showSource({currentTarget}) {
  clickTogle(currentTarget, 'showSource')
}

export function showHidden({currentTarget}) {
  clickTogle(currentTarget, 'showHidden')
}

function clickTogle(el, key) {
  setTimeout(_ => {
    reqs.update(json => {
      if (key==='showSource' && !el.checked) {
        json.options.autoParsed = false
        json.options.showHidden   = false
      }
      if (key!=='showSource' && !el.checked) {
        json.options.showSource    = false
      }
      json.options[key] = !el.checked
      return json
    })
  })
}
