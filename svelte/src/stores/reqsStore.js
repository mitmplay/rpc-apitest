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

async function requestEnv(sec, opt) {
  for (const id in sec) {
    const {run} = sec[id]
    if (run===undefined) {
      await requestEnv(sec[id], opt)
    } else if (sec[id].request) {
      const [xhr, ori, src] = await RPC.api.request(run, opt)
      sec[id].request = xhr
      sec[id].ori     = ori
      sec[id].src     = src
    }
  }
}

export function changeEnv(ns, env) {
  setTimeout(async ()=>{
    const sec = get(reqs).req[ns]
    await requestEnv(sec, {env})
    reqs.update(json => {
      json.req[ns]._template_.env = env || 'dev'
      return json
    })
  })
}

export function changeSlc(req, ns, sec, slc) {
  if (sec.slc!==slc) {
    sec.slc = slc
  } else {
    delete sec.slc
    slc = false
  }
  setTimeout(async ()=>{
    let sec2 = req[ns]
    const {env} = sec2._template_
    sec.run.split('/').slice(1,-1).forEach(k=>sec2 = sec2[k])

    await requestEnv(sec2, slc ? {env, slc} : {env})
    reqs.update(json => {
      json.req[ns] = req[ns]
      return json
    })
  })
}

async function _request(path) {
  const {req} = get(reqs)
  const nsp = path.split('/').shift()
  const env = req[nsp]?._template_?.env || 'dev'
  const slc = req[nsp]?._template_?.slc || ''
  return await RPC.api.request(path, {env, slc})
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
    if (req[file]) {
      req[file].request = xhr
      req[file].ori     = ori
      req[file].src     = src
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
        _template_.request = xhr
        _template_.ori     = ori
        _template_.src     = src
        if (xhr.select) {
          _template_.slcs = Object.keys(xhr.select)
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