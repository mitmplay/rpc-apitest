import { writable } from 'svelte/store';
const json = {
  logs: {},
  logs2: {},
  options: {
    dnsGrouping: true,
  }
}

export const logs = writable(json);

export function updateLogs(newLogs) {
  const _logs = {}
  const _logs2= {}
  logs.update(json => {
    for (const id in newLogs) {
      _logs[id] = json.logs[id] || newLogs[id]

      const {dns} = _logs[id]
      if (!_logs2[dns]) {
        _logs2[dns] = {
          id: dns,
          logs: {}
        }
      }
      _logs2[dns].logs[id] = _logs[id]
    }

    json.logs = _logs
    json.logs2 = _logs2
    window.json = json
    return json
  });
}

export function clickSummary(evn) {
  const el = evn.target.parentElement
  setTimeout(_ => {
    logs.update(json => {
      const {id,name} = el.dataset
      const open = (typeof el.getAttribute('open')==='string')
      json.logs[id][name]= open
      return json
    });  
  })
}
