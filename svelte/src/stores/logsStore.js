import { writable } from 'svelte/store';

export const logs = writable([]);

export function clickSummary(evn) {
  const el = evn.target.parentElement
  setTimeout(_ => {
    logs.update(arr => {
      const {id,name} = el.dataset
      const open = (typeof el.getAttribute('open')==='string')
      for (const lg of arr) {
        if (lg.id===+id) {
          lg[name] = open
          break
        }
      }
      return arr
    });  
  })
}
