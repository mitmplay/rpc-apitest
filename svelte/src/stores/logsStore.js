import { writable } from 'svelte/store';
const json = {
  logs : {}, //# all
  logs2: {}, //# api
  logs3: {}, //# date
  logs4: {}, //# host
  path: 'Logs',
  options: {
    activeTab: 1,
    grouping: '1', //# 1:all, 2:api 3:date, 4:host
    selectAll: false,
    autoExpandRequest: false,
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

function autoShow(json, _) {
  if (json.options.autoExpandRequest) {
    _.openRqs = true
  }
  if (json.options.autoExpandRespHdr) {
    _.openHdr = true
  }
  if (json.options.autoExpandRespBody) {
    _.openBody = true
  }
  return _
}

export const logs = writable(json);

export function updateLogs(newLogs) {
  const _logs = {} // all
  const _logs2= {} // api
  const _logs3= {} // date
  const _logs4= {} // host
  logs.update(json => {
    window.stores.log= json
    const {autoShowlog} = json.options
    const key = Object.keys(newLogs)[0]
    for (const id in newLogs) {

      // group by all
      _logs[id] = json.logs[id] || newLogs[id]
      if (autoShowlog && id===key) {  
        _logs[id]._ = autoShow(json, {})
        _logs[id].openLog = true
      }

      const {
        request,
        created=''
      } = _logs[id]

      let url;
      try {url = JSON.parse(request)?.url || ''} catch (error) {continue;}
      const match = url.match(/:\/\/([^/:]+)/) || ['all', 'undefined']

      const api  = match[1]
      const host = _logs[id].host
      const date = (new Date(created)).toISOString().replace(/T.+/,'')
      
      !_logs2[api ] && (_logs2[api ] = {id: api , logs: {}}); _logs2[api ].logs[id] = _logs[id]; // api
      !_logs4[host] && (_logs4[host] = {id: host, logs: {}}); _logs4[host].logs[id] = _logs[id]; // host
      !_logs3[date] && (_logs3[date] = {id: date, logs: {}}); _logs3[date].logs[id] = _logs[id]; // date
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

export async function autoExpand() {
  const path = window.location.hash.replace('#/','')
  if (path!==json.path) {
    let xpath = 'Logs'
    const arr = path.split('/').slice(1);
    if (arr.length) {
      const [grp] = arr[0].split('@');
      const id = ['#', 'all', 'api', 'date', 'host'].indexOf(grp);
      if (id>0) {
        logs.update(json => {
          json.options.grouping = id+''
          return json;
        })
      }
      for (const item of arr) {
        xpath += `/${item}`
        await new Promise(resolve => setTimeout(resolve, 120));
        const node = document.querySelector(`summary[data-path="${xpath}"]`)
        if (node) {
          const text = node.parentElement.getAttribute('open')
          if (text===null) {
            await new Promise(resolve => setTimeout(resolve, 10));
            node.click()
          }
        }  
      }
    }
  }
}

export function clickSummary(evn, lg) {
  const ct = evn.currentTarget
  const el = ct.parentElement
  setTimeout(_ => {
    logs.update(json => {
      const {path} = ct.dataset
      const {id,name} = el.dataset

      window.location.hash = `#/${path}`
      const open = (typeof el.getAttribute('open')==='string')
      if (json[lg][id]._===undefined) {
        json[lg][id]._ = {}
      }
      const _ = json[lg][id]._
      json[lg][id][name]= open
      if (RPC._obj_.argv.verbose) {
        console.log('JSON!', json[lg][id])
      }  
      if (name==='openLog') {
        autoShow(json, _)
      } else {
        _[name] = !_[name]
      }
      json.path = path
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

export function clickSelectAll({activeTab, rowid}) {
  setTimeout(_ => {
    logs.update(json => {
      const toggle = !json.options.selectAll
      json.options.selectAll = toggle
      for (const id in json.logs) {
        json.logs[id].chkLog = toggle
      }
      return json
    })
  })
}

export function clickCollapse({activeTab, rowid}) {
  setTimeout(_ => {
    logs.update(json => {
      for (const id in json.logs) {
        json.logs[id].openLog = false
        json.logs[id]._ = {}
      }
      if (activeTab===1) {
        const id = `_${rowid}`
        json.options.activeTab = 1
        json.options.grouping  = '1'
        json.logs[id].openLog  = true
        autoShow(json, json.logs[id]._)
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
export function activeTab() {
  const route = ['Logs', 'Request', 'Script', 'OpenApi', 'Docs']
  const {activeTab} = json.options
  return `#/${route[activeTab-1]}`
}

function clickTogle(el, key) {
  setTimeout(_ => {
    logs.update(json => {
      json.options[key] = !el.checked
      return json
    })
  })
}
