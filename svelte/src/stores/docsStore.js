import { writable } from 'svelte/store';
import { pretty } from '../lib/common';
const json = {
  doc: {},
}
export const docs = writable(json);

export async function init() {
  const doc1 = await window.RPC.api.docs()
  const doc2 = {}
  docs.update(_ => {
    for (const nspace in doc1) {
      doc2[nspace] = _.doc[nspace] || doc1[nspace]
    }
    _.doc = doc2
    return _
  })
  return doc2
}

// export async function updateDoc(path, content) {
//   if (!content) { // if it came from broadcast
//     content = await RPC.api.doc(path)
//   }

//   docs.update(_ => {
//     let {doc} = _
//     const folders = path.split('/')
//     const file = folders.pop()
//     for (const folder of folders) {
//       doc = doc[folder] || {}
//     }
//     if (doc[file]) {
//       doc[file].content = content
//     }
//     return _
//   })
// }

export function clickSummary(evn, doc, json) {
  const el = evn.currentTarget.parentElement
  setTimeout(async _1 => {
    const {nspace,name} = el.dataset
    const {run, content} = json[nspace]
    if (run && !content) {
      const data = await RPC.api.doc(run)
      json[nspace].content = data // pretty
    }
    docs.update(_2 => {
      const open = (typeof el.getAttribute('open')==='string')
      json[nspace][name]= open
      return {doc}
    });
  })
}

function collapse(_docs) {
  for (const key in _docs) {
    const doc = _docs[key]
    if (!/^_[a-zA-Z0-9.-]+$/.test(key)) {
      doc._openName = false
      if (!doc.run) {
        collapse(doc) 
      }  
    }
  }
}

export function clickCollapse(evn) {
  setTimeout(_ => {
    docs.update(json => {
      collapse(json.doc)
      return json
    })
  })
}