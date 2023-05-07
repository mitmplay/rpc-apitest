import { writable } from 'svelte/store';
const json = {
  rpc: {},
  options: {
    autoShowlog: true,
  }
}
export const rpc = writable(json);

export function filter(v) {
  if (/_template_/.test(v)) {
    return true
  } else {
    return !/^_/.test(v) 
  }
}

export function init(_rpc) {
  const rpcs = {}
  let arr = Object.keys(window.RPC)
  arr = arr.filter(filter).sort()
  for (const key1 of arr) {
    rpcs[key1] = _rpc.rpc[key1] || {}
    for (const key2 in window.RPC[key1]) {
      if (!rpcs[key1][key2]) {
        rpcs[key1][key2] = {code: '...'}
      }
    }
  }
  rpc.update(rpcSet => {
    rpcSet.rpc = rpcs
    return rpcSet
  })
  if (RPC._obj_.argv.debug) {
    console.log('Script onmount!', rpcs)
  }
}

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
    let initcode
    const open = (typeof el.getAttribute('open')==='string')
    if (open && _rpc[nspace][fn]?.code==='...') {
      let code = window.RPC[nspace][fn]+''
      if (/await +sendRequest/.test(code)) {
        initcode = await window.RPC.api.code(nspace, fn)
      } else {
        initcode = code.replace(/\t/g, '  ')
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

export function autoShowlog({currentTarget}) {
  clickTogle(currentTarget, 'autoShowlog')
}

function clickTogle(el, key) {
  setTimeout(_ => {
    rpc.update(json => {
      json.options[key] = !el.checked
      return json
    })
  })
}