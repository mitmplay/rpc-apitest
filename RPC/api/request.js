const fn = require('../../_rpc_')
const aReq = ['url', 'method', 'headers', 'body']

function _env(ob, env, key) {
  const tp3 = ob.env && ob.env[env] && ob.env[env][key] || undefined
  return tp3
}

function nested(arr, tp2, env) {
  key = arr.shift()
  const tp3 = _env(tp2, env, key) //# || tp2[key]
  if (arr.length) {
    return tp3 && nested(arr, tp3) || nested(arr, tp2[key])
  } else {
    return tp3 ||  tp2[key]
  }
}

function parser(xhr, tp2, env) {
  if (xhr.url===undefined) delete xhr.url
  if (xhr.body===undefined) delete xhr.body
  if (xhr.headers===undefined) delete xhr.headers
  
  for (const key in xhr) {
    let value1 = _env(xhr, env, key) || xhr[key]
    if (value1===undefined) {
      continue
    } else if (typeof value1!=='string') {
      parser(value1, tp2, env)
      continue
    }
    let match = value1.match(/\{([\w.]+)\}/g)
    if (match===null) {
      continue
    }
    match = match.map(x=>x.slice(1,-1))
    match.forEach((v,i) => {
      const arr = v.split('.')
      const value2 = nested(arr, tp2, env)
      if (match.length===1 && value1.trim()===`{${match[0]}}`) {
        value1 = value2
      } else {
        value1 = value1.replace(`{${match[0]}}`, value2)
      }
    })
    xhr[key] = value1
  }
  return xhr
}

function template(ns, name, merge) {
  const fullpathTemplate = `/${name}`.replace(/\/\w+$/, '/_template_')
  const arrpathTemplate = fullpathTemplate.split('/')
  const fileTemplate = arrpathTemplate.pop()

  let path = ''
  let template = {}
  const arr = arrpathTemplate.map(v=> {
    let tpl 
    if (v==='') {
      tpl = ns?._request_[fileTemplate]
    } else {
      path += `${v}/`
      tpl = ns?._request_[`${path}${fileTemplate}`]
    }
    template = merge(template, tpl)
  })
  console.log(name, template)
  return template
}

async function request(req='apidemo/u_agent_post', opt={}) {
  const match = req.match(/^(\w+)\/([\w/]+)$/)
  const _rpc_ = fn()
  if (!match) {
    const errmsg = {error: `request: ${req} is not there!`}
    console.error(errmsg)
    return errmsg
  }
  const [p0, nmspace, name] = match
  const {merge} = _rpc_._fn_
  const ns = _rpc_[nmspace]
  if (ns) {
    let xhr = ns._request_[name]
    const tp2 = template(ns, name, merge)
    if (tp2) {
      xhr = JSON.parse(JSON.stringify(xhr))
      const {url, headers, body, env='dev'} = opt
      if (tp2.default) {
        if (!(xhr.env || xhr.default)) {
          xhr = merge(tp2.default, xhr)
        }
      }
      xhr = merge(xhr, parser(xhr, tp2, env))
      if (url || headers || body) {
        xhr = merge(xhr, parser({url, headers, body}, tp2, env))
      }
    }
    const xhr2 = {}
    aReq.forEach(k => {
      if (xhr[k]) {
        xhr2[k] = xhr[k]
      }
    })
    return xhr.env || xhr.default ? xhr : xhr2
  }
}
module.exports = request
