import { writable } from 'svelte/store';

export const logs = writable({});

export function updateLogs(oldlogs, newLogs) {
  const l = {}
  logs.update(() => {
    for (const id in newLogs) {
      l[id] = oldlogs[id] || newLogs[id]
    }
    return l
  });
}

export function clickSummary(evn) {
  const el = evn.target.parentElement
  setTimeout(_ => {
    logs.update(l => {
      const {id,name} = el.dataset
      const open = (typeof el.getAttribute('open')==='string')
      l[id][name]= open
      return l
    });  
  })
}
