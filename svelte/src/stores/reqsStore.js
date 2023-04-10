import { writable } from 'svelte/store';
const json = {
  req: {},
}
export const reqs = writable(json);

export async function init() {
  const req1 = await window.RPC.api.requests(true)
  const req2 = {}
  reqs.update(_ => {
    for (const nspace in req1) {
      req2[nspace] = _.req[nspace] || req1[nspace]
    }
    _.req = req2
    return _
  })
  return req2
}

export function clickSummary(evn, req, json) {
  const el = evn.currentTarget.parentElement
  setTimeout(async _1 => {
    const {nspace,name} = el.dataset
    const {run, request} = json[nspace]
    if (run && !request) {
      const request = await RPC.api.request(run)
      json[nspace].request = JSON.stringify(request, null, 2)
    }
    reqs.update(_2 => {
      const open = (typeof el.getAttribute('open')==='string')
      json[nspace][name]= open
      return {req}
    });
  })
}

export function showRequest(evn, req, json) {

}