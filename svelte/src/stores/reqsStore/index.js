import { writable, get } from 'svelte/store';
import {events} from'./actionEvents';

const json = {
  req: {},
  path: 'Request',
  options: {
    autoParsed: true,
    showHeader: false,
    showHidden: false,
    showSource: false,
    showCommand: false,
    showTemplate: false,
    showClr: false,
    showRpc: false,
    showLog: false,
  }
}
export const reqs = writable(json);

export async function init() {
  const req1 = await window.RPC.api.requests(true)
  const req2 = {}
  reqs.update(json => {
    window.stores.req = json
    function recursive(req, path1='') {
      for (const path2 in req) {
        const obj = req[path2]
        if (typeof obj!=='string') {
          const xpath = `${path1}/${path2}`
          obj._path_ = xpath
          if (obj.run===undefined) {
            recursive(obj, xpath)
          }
        }
      }
    }
    for (const nspace in req1) {
      req2[nspace] = json.req[nspace] || req1[nspace]
      req2[nspace]._path_ = nspace
      recursive(req2[nspace], nspace)
    }
    json.req = req2
    return json
  })
  return req2
}

function syncStor(req, path, xhr, ori, src, logs) {
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
  req.logs    = logs
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
    if ((run===undefined || (!run.match(/_template_$/) && !run.match(RegExp(`${id}$`)))) && 
      typeof sec[id]==='object' && sec[id]!==null ) {
      await requestEnv(sec[id], opt)
    } else if (sec[id].request) {
      const slc = Object.keys(opt.slc) // slc translate to array
      const opt2 = {...opt, slc, var: true} // before rpc call
      if (sec[id]._run) {
        opt2.run = sec[id]._run      
      }
      const [xhr, ori, src, logs] = await RPC.api.request(run, opt2)
      syncStor(sec[id], run, xhr, ori, src, logs)
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

export function updateSection(path, kv={}) {
  const [ns, ...arr] = path.split('/')
  let req = json.req[ns]
  let sec = req
  arr.forEach(k=>{
    sec = sec[k]
  })
  for (const k in kv) {
    sec[k] = kv[k]
  }
  reqs.update(json => {
    json.req[ns] = req
    return json
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
    const [xhr, ori, src, logs] = await RPC.api.request(sec.run, opt)
    syncStor(sec, sec.run, xhr, ori, src, logs)
    reqs.update(json => {
      json.req[ns] = req[ns]
      return json
    })
  })
}

export async function _request(path, rpc=true) {
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
  // for merging template
  // re-parser _template_ if non _templete_ is updated
  if (path.match(/_[^_]+_$/) && path!=='_template_') {
    path = path.replace(/_[^_]+_$/, '_template_')
  }
  const [xhr, ori, src, logs] = await RPC.api.request(path, opt) // if it came from broadcast
  if (!xhr) {
    return
  }
  syncStor(xreq[file], path, xhr, ori, src, logs)
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
    const folders = path.split('/')
    const ns = folders.shift();
    const file = folders.pop().replace(/\.yaml$/, '')
    const sec = get(reqs).req[ns]
    let req = sec
    for (const folder of folders) {
      if (req[folder]===undefined) {
        req[folder] = {}
      }
      req = req[folder]
    }
    const env = sec?._template_?._env || ''
    const reqOpt = {env, slc:{}}
    if (opt._act==='del') {
      delete req[file]
      if (file==='_template_') {
        await requestEnv(sec, reqOpt)
      }
    } else {
      if (!req[file]) {
        const run = path.replace(/\.yaml$/, '')
        req[file] = {run}
      }
      await requestEnv(sec, reqOpt)
    }
    reqs.update(json => {
      json.req[ns] = sec
      return json
    })
    return

  }
  await updateState(path)
}

export async function autoExpand() {
  const path = window.location.hash.replace('#/','')
  if (path!==json.path) {
    let xpath = 'Request'
    const arr = path.split('/').slice(1);
    for (const item of arr) {
      xpath += `/${item}`
      await new Promise(resolve => setTimeout(resolve, 120));
      const node = document.querySelector(`summary[data-path="${xpath}"]`)
      if (node) {
        const text = node.parentElement.getAttribute('open')
        if (text===null) {
          await new Promise(resolve => setTimeout(resolve, 10));
          node.click()
        }
      }  
    }
  }
}

export function clickSummary(evn, req, ns, json) {
  const ct = evn.currentTarget
  const el = ct.parentElement
  setTimeout(async _1 => {
    const {path} = ct.dataset
    const {nspace,name} = el.dataset
    window.location.hash = `#/${path}`

    const sec = json[nspace]
    if (sec.run && !sec.request) {
      const [xhr, ori, src, logs] = await _request(sec.run)
      syncStor(sec, sec.run, xhr, ori, src, logs)
    } else if (sec._template_) {
      const {_template_: tpl} = sec
      if (!tpl.ori) {
        const [xhr, ori, src, logs] = await _request(tpl.run)
        syncStor(tpl, tpl.run, xhr, ori, src, logs)
      }
    }
    for (const key in json[nspace]) {
      const sec = json[nspace][key]
      if (sec && !sec._runs && sec.run) {
        if (!sec._runs && !/_template_/.test(sec.run)) {
          const [xhr, ori, src, logs] = await _request(sec.run, false)
          if (!xhr) {
            continue
          }
          syncStor(sec, sec.run, xhr, ori, src, logs)
        }
      }
    }
    const root = ns || nspace
    if (RPC._obj_.argv.verbose) {
      console.log('JSON!', json)
    }  
    reqs.update(_2 => {
      const open = (typeof el.getAttribute('open')==='string')
      json[nspace][name]= open
      _2.req[root] = req[root]
      _2.path = path
      return _2
    });
  }, 0)
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

export function actionEvents() {
  return events(reqs, collapse)
}