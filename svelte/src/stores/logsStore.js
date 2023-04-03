import { writable } from 'svelte/store';
const json = {
  logs: {},
  logs2: {},
  options: {
    dnsGrouping: false,
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

export function clickSummary(evn, lg) {
  const el = evn.target.parentElement
  setTimeout(_ => {
    logs.update(json => {
      const {id,name} = el.dataset
      const open = (typeof el.getAttribute('open')==='string')
      json[lg][id][name]= open
      return json
    });  
  })
}

export function clickGroup(evn) {
  setTimeout(_ => {
    logs.update(json => {
      json.options.dnsGrouping = !json.options.dnsGrouping
      return json
    })
  })
}

export function clickCollapse(evn) {
  setTimeout(_ => {
    logs.update(json => {
      for (const id in json.logs) {
        const obj = json.logs[id]
        obj.openLog = false
        obj.openRqs = false
        obj.openHdr = false
      }
      return json
    })
  })
}