import { writable } from 'svelte/store';
const json = {
  logs: {},
  logs2: {},
  logs3: {},
  options: {
    grouping: '1', //# 1:all, 2:Host, 3:Time
    yaml: false,
  }
}

export const logs = writable(json);

export function updateLogs(newLogs) {
  const _logs = {}
  const _logs2= {}
  const _logs3= {}
  logs.update(json => {
    for (const id in newLogs) {
      _logs[id] = json.logs[id] || newLogs[id]
      // group by host
      const {host} = _logs[id]
      if (!_logs2[host]) {
        _logs2[host] = {
          id: host,
          logs: {}
        }
      }
      _logs2[host].logs[id] = _logs[id]
      // group by date
      const date = (new Date(_logs[id]?.created)).toISOString().replace(/T.+/,'')
      if (!_logs3[date]) {
        _logs3[date] = {
          id: date,
          logs: {}
        }
      }
      _logs3[date].logs[id] = _logs[id]
    }

    json.logs  = _logs
    json.logs2 = _logs2
    json.logs3 = _logs3
    window.json= json
    return json
  });
}

export function clickSummary(evn, lg) {
  const el = evn.currentTarget.parentElement
  setTimeout(_ => {
    logs.update(json => {
      const {id,name} = el.dataset
      const open = (typeof el.getAttribute('open')==='string')
      json[lg][id][name]= open
      return json
    });  
  })
}

export function clickGroup({currentTarget}) {
  setTimeout(_ => {
    logs.update(json => {
      json.options.grouping = currentTarget.value
      return json
    })
  })
}

export function clickYaml({currentTarget}) {
  setTimeout(_ => {
    logs.update(json => {
      json.options.yaml = !currentTarget.checked
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