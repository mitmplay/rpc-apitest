import { writable } from 'svelte/store';
import { pretty } from '../lib/common';
const json = {
  req: {},
  options: {
    autoShowlog: true,
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

export async function updateReq(path, request) {
  if (!request) { // if it came from broadcast
    request = await RPC.api.request(path)
  }

  reqs.update(json => {
    let {req} = json
    const folders = path.split('/')
    const file = folders.pop()
    for (const folder of folders) {
      req = req[folder] || {}
    }
    if (req[file]) {
      req[file].request = pretty(request)
    }
    return json
  })
}

export function clickSummary(evn, req, json) {
  const el = evn.currentTarget.parentElement
  setTimeout(async _1 => {
    const {nspace,name} = el.dataset
    const {run, request} = json[nspace]
    if (run && !request) {
      const data = await RPC.api.request(run)
      json[nspace].request = pretty(data)
    }
    reqs.update(_2 => {
      const open = (typeof el.getAttribute('open')==='string')
      json[nspace][name]= open
      _2.req = req
      return _2
    });
  })
}

function collapse(_reqs) {
  for (const key in _reqs) {
    const req = _reqs[key]
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

export function autoShowlog({currentTarget}) {
  clickTogle(currentTarget, 'autoShowlog')
}

function clickTogle(el, key) {
  setTimeout(_ => {
    reqs.update(json => {
      json.options[key] = !el.checked
      return json
    })
  })
}