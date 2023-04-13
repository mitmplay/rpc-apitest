const fn  = require('../../_rpc_')

function merge(obj1, obj2) {
  let result = {};
  
  for (let key in obj1) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        result[key] = merge(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    } else {
      result[key] = obj1[key];
    }
  }
  
  for (let key in obj2) {
    if (!obj1.hasOwnProperty(key)) {
      result[key] = obj2[key];
    }
  }
  
  return result;
}

function nested(arr, obj1) {
  key = arr.shift()
  const obj2 = obj1[key]
  if (arr.length) {
    return nested(arr, obj2)
  } else {
    return obj2
  }
}

function parser(xhr, tp2) {
  if (xhr.url===undefined) delete xhr.url
  if (xhr.body===undefined) delete xhr.body
  if (xhr.headers===undefined) delete xhr.headers
  
  for (const key in xhr) {
    let value1 = xhr[key]
    if (value1===undefined) {
      continue
    } else if (typeof value1!=='string') {
      parser(value1, tp2)
      continue
    }
    let match = value1.match(/\{([\w.]+)\}/g)
    if (match===null) {
      continue
    }
    match = match.map(x=>x.slice(1,-1))
    match.forEach((v,i) => {
      const arr = v.split('.')
      const value2 = nested(arr, tp2)
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
    const xhr = _rpc_[nmspace]?._request_[name]
    const tp1 = `/${name}`.replace(/\/\w+$/, '/_template_').slice(1)
    const tp2 = tp1 ? _rpc_[nmspace]?._request_[tp1] : null
    if (tp2) {
      const {url, headers, body} = opt
      if (url || headers || body) {
        return  merge(xhr, parser({url, headers, body}, tp2))
      } else {
        return parser(xhr, tp2)
      }
    }
    return xhr
  }
}
module.exports = request
