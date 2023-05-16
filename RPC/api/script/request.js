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
    let spread = false
    if (v.match(/(^\.{3})\w+/)) {
      v = v.replace(/^\.{3}/, '')
      spread = true
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
    if (spread && `{...${v}}`===value1.trim()) {
      value1 = {
        _spread_: true,
        values: value2
      }
    } else {
      const str = tp1 ? `{{${v}}}` : `{${v}}`
      if (match.length===1 && str===value1.trim()) {
        value1 = value2
      } else {
        value1 = value1.replace(str, value2)
      }  
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
      const newjson = parser(value1, ns, tp2, env)
      if (tp2[key]) {
        tp2[key] = rpc()._fn_.merge(newjson, tp2[key])
      } else {
        tp2[key] = newjson
      }
      continue
    }
    // interpolation key with '-' and '.' separator
    value1 = interpolate(fncRegx, value1, tp2, env, key, ns)
    value1 = interpolate(varRegx, value1, tp2, env, key)
    if (value1===undefined) {
      continue
    }
    if (value1._spread_) {
      delete xhr[key]
      for (const id in value1.values) {
        xhr[id] = value1.values[id]
      }
    } else {
      xhr[key] = value1
    }
  }
  return xhr
}

//# name: simple-get/xkcd
//# tpl1: simple-get/_template_
//# tpl2: simple-get/xkcd/_template_
function template(ns, name, merge, env) {
  const fullpathTemplate = `/${name}`.replace(/\/[^/]+$/, '/_template_')
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
    if (tpl) {
      tpl = JSON.parse(JSON.stringify(tpl))
      // 1st iteration template={} need to parser to it-self
      if (i===0) {
        if (tpl.env && tpl.env[env]) {
          tpl = merge(tpl, parser(tpl.env[env], false, tpl))
        }  
        template = merge(template, parser(tpl, ns, tpl))
      } else {
        template = merge(template, parser(tpl, ns, template))
      }
    }
  })
  console.log(name, template)
  return template
}
//# await RPC.api.fetch('apidemo/simple-get/xkcd')
//# namespace: apidemo
//# name: simple-get/xkcd
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
    const tp2 = template(ns, name, merge, opt.env|| 'dev')
    const src = ns._request_src_[name]
    const ori = ns._request_[name]
    if (ori===undefined) {
      return [{},{}]
    }
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
    return [name.includes('_template_') ? xhr : xhr2, ori, src]
  }
}
module.exports = request
