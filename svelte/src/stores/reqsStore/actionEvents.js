const singleton = {reqs: {}}
function clickTogle(el, key) {
  setTimeout(_ => {
    singleton.reqs.update(json => {
      if (key==='showSource' && !el.checked) {
        json.options.autoParsed   = false
        json.options.showHeader   = false
        json.options.showHidden   = true
        json.options.showTemplate = true
      }
      if (key==='autoParsed' && !el.checked) {
        json.options.showSource = false
        json.options.showHeader = true
      }
      json.options[key] = !el.checked
      return json
    })
  })
}

function autoParsed({currentTarget}) {
  clickTogle(currentTarget, 'autoParsed')
}
  
function showSource({currentTarget}) {
  clickTogle(currentTarget, 'showSource')
}
  
function showHidden({currentTarget}) {
  clickTogle(currentTarget, 'showHidden')
}
  
function showHeader({currentTarget}) {
  clickTogle(currentTarget, 'showHeader')
}
  
function showCommand({currentTarget}) {
  clickTogle(currentTarget, 'showCommand')
}
  
function showTemplate({currentTarget}) {
  clickTogle(currentTarget, 'showTemplate')
}
  
function showClr({currentTarget}) {
  clickTogle(currentTarget, 'showClr')
}
  
function showRpc({currentTarget}) {
  clickTogle(currentTarget, 'showRpc')
}

function showLog({currentTarget}) {
  clickTogle(currentTarget, 'showLog')
}

function clickCollapse(evn) {
  setTimeout(_ => {
    singleton.reqs.update(json => {
      singleton.collapse(json.req)
      return json
    })
  })
}

export function events(reqs, collapse) {
  singleton.collapse = collapse
  singleton.reqs = reqs
  return {
    autoParsed,
    showSource,
    showHidden,
    showHeader,
    showCommand,
    showTemplate,
    showClr,
    showRpc,
    showLog,
    clickCollapse,
  }
}