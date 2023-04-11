import { writable } from 'svelte/store';
const json = {
  rpc: {},
}
export const rpc = writable(json);

export function clickSummary(evn) {
  const el = evn.currentTarget.parentElement
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
  const el = evn.currentTarget.parentElement
  const {nspace, fn} = el.dataset
  setTimeout(async _ => {
    let initcode = false
    const open = (typeof el.getAttribute('open')==='string')
    if (open && _rpc[nspace][fn]?.code==='...') {
      console.log('show code')
      let code = window.RPC[nspace][fn]+''
      if (code.includes('sendRequest')) {
        initcode = await window.RPC.api.code(nspace, fn)
      }
    }
    rpc.update(json => {
      if (initcode) {
        json.rpc[nspace][fn].code = initcode
      }
      json.rpc[nspace][fn]._openCode = open
      return json
    })
  })
}

export function clickCollapse(evn) {
  setTimeout(_ => {
    rpc.update(json => {
      for (const id1 in json.rpc) {
        const api = json.rpc[id1]
        api._openName = false
        for (const id2 in api) {
          const code = api[id2]
          if (!/^_/.test(id2)) {
            code._openCode = false
          }
        }
      }
      return json
    })
  })
}