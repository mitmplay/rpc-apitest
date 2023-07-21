import { writable } from 'svelte/store';
const json = {
  logs: {},  //# all
  logs2: {}, //# host
  logs3: {}, //# time
  logs4: {}, //# api
  options: {
    activeTab: 1,
    grouping: '1', //# 1:all, 2:host 3:time, 4:api
    autoExpandRequest: true,
    autoExpandRespHdr: false,
    autoExpandRespBody: true,
    limithdr: true,
    hideHost: false,
    showttips: false,
    autoShowlog: false,
    autoShowDate: false,
    autoShowElapse: false,
    tips: false,
    yaml: true,
  }
}

export const logs = writable(json);

export function updateLogs(newLogs) {
  const _logs = {}
  const _logs2= {}
  const _logs3= {}
  const _logs4= {}
  logs.update(json => {
    window.stores.log= json
    for (const id in newLogs) {
      _logs[id] = json.logs[id] || newLogs[id]
      // group by host
      const {host, request, created=''} = _logs[id]
      const url = JSON.parse(request)?.url || ''
      const match = url.match(/:\/\/([^/:]+)/) || ['all', 'undefined']
      const domain = match[1]
      if (!_logs2[host]) {
        _logs2[host] = {
          id: host,
          logs: {}
        }
      }
      _logs2[host].logs[id] = _logs[id]
      // group by date
      const date = (new Date(created)).toISOString().replace(/T.+/,'')
      if (!_logs3[date]) {
        _logs3[date] = {
          id: date,
          logs: {}
        }
      }
      _logs3[date].logs[id] = _logs[id]
      if (domain && !_logs4[domain]) {
        _logs4[domain] = {
          id: domain,
          logs: {}
        }
      }
      _logs4[domain].logs[id] = _logs[id]
    }

    json.logs  = _logs
    json.logs2 = _logs2
    json.logs3 = _logs3
    json.logs4 = _logs4
    return json
  });
}

export function clickChecked({currentTarget}) {
  const el = currentTarget.parentElement.parentElement
  setTimeout(_ => {
    logs.update(json => {
      const {id} = el.dataset
      json.logs[id].chkLog = currentTarget.checked
      return json
    })
  })
}

export function clickSummary(evn, lg) {
  const el = evn.currentTarget.parentElement
  setTimeout(_ => {
    logs.update(json => {
      const {id,name} = el.dataset
      const open = (typeof el.getAttribute('open')==='string')
      if (json[lg][id]._===undefined) {
        json[lg][id]._ = {}
      }
      const _ = json[lg][id]._
      _[name]= open
      if (name==='openLog') {
        if (json.options.autoExpandRespBody) {
          _.openBody = true
        }
        if (json.options.autoExpandRespHdr) {
          _.openHdr = true
        }
        if (json.options.autoExpandRequest) {
          _.openRqs = true
        }
      }
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

export function clickCollapse({activeTab, rowid}) {
  setTimeout(_ => {
    logs.update(json => {
      for (const id in json.logs) {
        json.logs[id]._ = {}
      }
      if (activeTab===1) {
        const id = `_${rowid}`
        json.options.activeTab = 1
        json.options.grouping  = '1'
        json.logs[id].openLog  = true
        if (json.options.autoExpandRespBody) {
          json.logs[id]._.openBody = true
        }
        if (json.options.autoExpandRespHdr) {
          json.logs[id]._.openHdr = true
        }
        if (json.options.autoExpandRequest) {
          json.logs[id]._.openRqs = true
        }
      }
      return json
    })
  }, activeTab ? 410 : 0)
}

export function clickYaml({currentTarget}) {
  clickTogle(currentTarget, 'yaml')
}

export function autoExpandRequest({currentTarget}) {
  clickTogle(currentTarget, 'autoExpandRequest')
}

export function autoExpandRespHdr({currentTarget}) {
  clickTogle(currentTarget, 'autoExpandRespHdr')
}

export function autoExpandRespBody({currentTarget}) {
  clickTogle(currentTarget, 'autoExpandRespBody')
}

export function hideHost({currentTarget}) {
  clickTogle(currentTarget, 'hideHost')
}

export function limithdr({currentTarget}) {
  clickTogle(currentTarget, 'limithdr')
}

export function showttips({currentTarget}) {
  clickTogle(currentTarget, 'showttips')
}

export function autoShowlog({currentTarget}) {
  clickTogle(currentTarget, 'autoShowlog')
}

export function autoShowDate({currentTarget}) {
  clickTogle(currentTarget, 'autoShowDate')
}

export function autoShowElapse({currentTarget}) {
  clickTogle(currentTarget, 'autoShowElapse')
}

function clickTogle(el, key) {
  setTimeout(_ => {
    logs.update(json => {
      json.options[key] = !el.checked
      return json
    })
  })
}
