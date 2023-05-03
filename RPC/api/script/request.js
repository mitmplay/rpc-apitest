const aReq = ['url', 'method', 'headers', 'body']

function _env(ob, env, key) {
  const tp3 = ob.env && ob.env[env] && ob.env[env][key] || undefined
  return tp3
}

function nested1(arr, tp1) {
  key = arr.shift()
  if (arr.length) {
    return nested1(arr, tp1[key])
  } else {
    return tp1[key] && tp1[key]()
  }
}

function nested2(arr, tp2, env) {
  key = arr.shift()
  const tp3 = _env(tp2, env, key) //# || tp2[key]
  if (arr.length) {
    return tp3 && nested2(arr, tp3) || nested2(arr, tp2[key])
  } else {
    return tp3 ||  tp2[key]
  }
}

function interpolate(regx, value1, tp2, env, key, ns) {
  let match = value1.match(regx)
  if (match===null) {
    return value1
  }
  const tp1 = ns && ns._template_ && ns._template_()
  match = match.map(x=>(tp1 ? x.slice(2,-2) : x.slice(1,-1)))
  match.forEach((v,i) => {
    if (v.match('&')) { // ua: {&-tpl} => ua: {ua-tpl}
      const old = `{${v}}`
      v = v.replace(/&/g, key)
      value1 = value1.replace(old, `{${v}}`)
    }
    const arr = v.split('.')
    let value2 
    if (tp1) {
      if (v.includes('chance.')) {
        const fname = arr[1]
        const {chance:c} = rpc()._lib_
        value2 = c[fname] && (fname==='version' ? c.VERSION : c[fname]())
      } else {
        value2 = nested1(arr, tp1)
      }
    } else {
      value2 = nested2(arr, tp2, env)
    }
    const str = tp1 ? `{{${v}}}` : `{${v}}`
    if (match.length===1 && str===value1.trim()) {
      value1 = value2
    } else {
      value1 = value1.replace(str, value2)
    }
  })
  return value1
}

function parser(xhr, ns, tp2, env) {
  if (xhr.url===undefined) delete xhr.url
  if (xhr.body===undefined) delete xhr.body
  if (xhr.headers===undefined) delete xhr.headers
  
  const fncRegx = /\{\{([\w-.&]+)\}\}/g
  const varRegx = /\{([\w-.&]+)\}/g
  for (const key in xhr) {
    let value1 = env && _env(xhr, env, key) || xhr[key]
    if (value1===undefined) {
      continue
    } else if (typeof value1!=='string') {
      parser(value1, ns, tp2, env)
      continue
    }
    // interpolation key with '-' and '.' separator
    value1 = interpolate(fncRegx, value1, tp2, env, key, ns)
    value1 = interpolate(varRegx, value1, tp2, env, key)
    if (value1===undefined) {
      continue
    }
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
  const arr = arrpathTemplate.map((v, i)=> {
    let tpl 
    if (v==='') {
      tpl = ns?._request_[fileTemplate]
    } else {
      path += `${v}/`
      tpl = ns?._request_[`${path}${fileTemplate}`]
    }
    tpl = JSON.parse(JSON.stringify(tpl))
    // 1st iteration template={} need to parser to it-self
    template = merge(template, parser(tpl, ns, i?template:tpl))
  })
  console.log(name, template)
  return template
}

async function request(req='apidemo/u_agent_post', opt={}) {
  const match = req.match(/^([\w-]+)\/([\w-/]+)$/)
  const _rpc_ = rpc()
  if (!match) {
    const errmsg = {error: `request: ${req} is not there!`}
    console.error(errmsg)
    return errmsg
  }
  const [p0, nmspace, name] = match
  const {merge} = _rpc_._fn_
  const ns = _rpc_[nmspace]
  if (ns) {
    const tp2 = template(ns, name, merge)
    const ori = ns._request_[name]
    let xhr = JSON.parse(JSON.stringify(ori))
    if (tp2) {
      const {url, headers, body, env='dev'} = opt
      if (tp2.default) {
        if (!name.includes('_template_')) {
          xhr = merge(tp2.default, xhr)
        }
      }
      xhr = merge(xhr, parser(xhr, ns, tp2, env))
      if (url || headers || body) {
        xhr = merge(xhr, parser({url, headers, body}, ns, tp2, env))
      }
    }
    const xhr2 = {}
    aReq.forEach(k => {
      if (xhr[k]) {
        xhr2[k] = xhr[k]
      }
    })
    return [name.includes('_template_') ? xhr : xhr2, ori]
  }
}
module.exports = request
