const fn  = require('../../_rpc_')

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

async function request(req='apidemo/u_agent_post', opt={}) {
  const match = req.match(/^(\w+)\/([\w/]+)$/)
  const _rpc_ = fn()
  if (!match) {
    const errmsg = {error: `request: ${req} is not there!`}
    console.error(errmsg)
    return errmsg
  }
  const [p0, nmspace, name] = match
  if (_rpc_[nmspace]) {
    let xhr = _rpc_[nmspace]?._request_[name]
    const tp1 = `/${name}`.replace(/\/\w+$/, '/_template_').slice(1)
    const tp2 = tp1 ? _rpc_[nmspace]?._request_[tp1] : null
    if (tp2) {
      xhr = JSON.parse(JSON.stringify(xhr))
      const {url, headers, body, env='dev'} = opt
      xhr = _rpc_._fn_.merge(xhr, parser(xhr, tp2, env))
      if (url || headers || body) {
        xhr = _rpc_._fn_.merge(xhr, parser({url, headers, body}, tp2, env))
      }
    }
    return xhr
  }
}
module.exports = request
