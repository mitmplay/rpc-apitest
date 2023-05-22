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

function syncStor(template, run, xhr, ori, src) {
  if (/_template_/.test(run)) {
    if (typeof xhr.select==='object' && xhr.select!==null) {
      template.slcs = Object.keys(xhr.select)
    } else {
      delete template.slcs
      template.slc = ''
    }
  }
  template.request = xhr
  template.ori     = ori
  template.src     = src
}

async function requestEnv(sec, opt) {
  if (/_template_/.test(sec?._template_?.run)) {
    if (sec._template_.slc) {
      opt.slc = sec._template_.slc
    }
  }
  for (const id in sec) {
    const {run} = sec[id]
    if (run===undefined) {
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
  if (_template_.env!==env) {
    _template_.env = env
  } else {
    delete _template_.env
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
  const opt = {}
  const {req} = get(reqs)
  const nsp = path.split('/').shift()
  const {env, slc} = req[nsp]?._template_ || {}
  env && (opt.env = env)
  slc && (opt.slc = slc)
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
    if (req[file]) {
      syncStor(req[file], path, xhr, ori, src) 
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