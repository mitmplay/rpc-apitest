import { writable } from 'svelte/store';
const json = {
  rpc: {},
}
export const rpc = writable(json);

export function clickSummary(evn) {
  const el = evn.target.parentElement
  setTimeout(_ => {
    rpc.update(json => {
      const {nspace,name} = el.dataset
      const open = (typeof el.getAttribute('open')==='string')
      json.rpc[nspace][name]= open
      return json
    });  
  })
}

export function showCode(evn, _rpc) {
  const el = evn.target.parentElement
  const {nspace, fn} = el.dataset
  setTimeout(async _ => {
    const open = (typeof el.getAttribute('open')==='string')
    if (open && _rpc[nspace][fn]?.code==='...') {
      console.log('show code')
      const code = await window.RPC.api.code(nspace, fn)
      rpc.update(json => {
        json.rpc[nspace][fn].code = code
        return json
      })
    }
  })
}