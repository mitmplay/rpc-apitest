function _env(ob, key, env='') {
  let tp3
  try {
    tp3 = ob.env && ob.env[env] && ob.env[env][key] || undefined    
  } catch (error) {
    console.log(error)
  }
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
  const tp3 = _env(tp2, key, env) // || tp2[key]
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
  match.forEach((v,i) => {
    let x = v
    let xfn = false
    if (v.match(/^{{[\w.]+}}$/)) {
      x = v.slice(2,-2)
      xfn = true
    } else {
      x = v.slice(1,-1)
    }
    if (x.match('&')) { // ua: {&-tpl} => ua: {ua-tpl}
      const old = `{${x}}`
      x = x.replace(/&/g, key)
      value1 = value1.replace(old, `{${x}}`)
    }
    const [id, vl] = x.split(':')
    let value2
    if (vl) {
      value2 = {}
      value2[id] = vl.match(/^[0-9.]+$/) ? +vl : vl.trim()
      value1 = value2
      return value1
    }
    let spread = false
    if (x.match(/(^\.{3})\w+/)) {
      x = x.replace(/^\.{3}/, '')
      spread = true
    }
    const arr = x.split('.')
    if (xfn) {
      if (x.includes('chance.')) {
        const fname = arr[1]
        const {chance:c} = rpc()._lib_
        value2 = c[fname] && (fname==='version' ? c.VERSION : c[fname]())
      } else if (tp1) {
        value2 = nested1(arr, tp1)
      }
    } else {
      value2 = nested2(arr, tp2, env)
    }
    if (spread && `{...${x}}`===value1.trim()) {
      value1 = {
        _spread_: true,
        values: value2
      }
    } else {
      const str = xfn ? `{{${x}}}` : `{${x}}`
      if (match.length===1 && str===value1.trim()) {
        value1 = value2
      } else {
        value1 = value1.replace(str, `${value2}`)
      }
      if (`${value1}`.includes('{&}')) {
        value1 = value1.replace('{&}', '')
      }
    }
  })
  return value1
}

const varRegx = /\{([\w-_ .&:{]+)\}+/g
const fncRegx = /\{\{([\w-.&]+)\}\}/g
function parser(ori, xhr, ns, tp2, opt={}) {
  if (xhr.url===undefined) delete xhr.url
  if (xhr.body===undefined) delete xhr.body
  if (xhr.headers===undefined) delete xhr.headers

  const arr = []
  const set_object = (key) => {
    let value1 = xhr[key]
    if (opt.env) {
      const evalue =_env(xhr, key, opt.env)
      if (evalue) {
        value1 = evalue
      }
    } 
    if (value1===undefined) {
      return
    } else if (value1!==null && typeof value1==='object') { // recursive parser - do-not change!
      if (!Array.isArray(value1) || (value1.length && `${value1[0]}`.includes('{...'))) {
        const result = parser(ori, value1, ns, tp2, opt)
        if (typeof xhr[key]!=='object' || Array.isArray(result)) {
          xhr[key] = result
        } else {
          xhr[key] = {
            ...xhr[key],
            ...result,
          }  
        }
        return xhr
      } 
    }
    // interpolation key with '-' and '.' separator 
    if (typeof value1==='string') {
      value1 = interpolate(fncRegx, value1, tp2, opt.env, key, ns)
      value1 = interpolate(varRegx, value1, tp2, opt.env, key)  
    }
    if (value1===undefined) {
      return
    }
    if (value1._spread_) {
      const {values} = value1
      if (Array.isArray(xhr)) {
        if (!Array.isArray(values)) {
          arr.push(value1)
        } else {
          values.forEach(x=>arr.push(x))
        }
      } else {
        delete xhr[key]
        for (const id in values) {
          xhr[id] = values[id]
        }  
      }
    } else {
      if (Array.isArray(xhr)) {
        arr.push(value1)
      } else {
        xhr[key] = value1
      }
    }
  }

  if (Array.isArray(xhr)) {
    xhr.forEach((v,i) => set_object(i))
    arr.forEach((v,i) => (xhr[i] = v))
  } else {
    for (const key in xhr) {
      set_object(key)
    }  
  }
  return xhr
}

function startParsing(xp1, ns, xp2, opt) {
  // parse vars in xp1 and find value on xp2
  const tp1 = JSON.parse(JSON.stringify(xp1))
  const tp2 = JSON.parse(JSON.stringify(xp2))
  const rtn = parser(tp1, tp1, ns, tp2, opt)
  // console.log(JSON.stringify(rtn,0,2))
  return rtn
}

function template(ns, name, opt) {
  const fullpathTemplate = `/${name}`.replace(/\/[^/]+$/, '/_template_')
  const arrpathTemplate = fullpathTemplate.split('/')
  const fileTemplate = arrpathTemplate.pop()
  const {merge} = rpc()._fn_

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
      let parsed;
      const {env='', slc={}} = opt
      tpl = JSON.parse(JSON.stringify(tpl))
      if (i===0) {
        // parse to it-self
        parsed = startParsing(tpl, ns, tpl, {env})
        template = merge(template, parsed)
      } else {
        // merged & parse to it-self
        template = merge(template, tpl)
        template = startParsing(template, ns, template, {env})
        if (template.select && template.select[slc]) {
          template = merge(template,template.select[slc])
        }
      }
    }
  })
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
    let tp2 = template(ns, name, opt)
    const src = ns._request_src_[name]
    const ori = ns._request_[name]
    if (ori===undefined) {
      return [{},{}]
    }
    let xhr = JSON.parse(JSON.stringify(ori))
    if (tp2) {
      const {url, headers, body, env, slc, run} = opt
      if (tp2.default) {
        // merge default to request
        if (!name.includes('_template_')) {
          xhr = merge(tp2.default, xhr) //# donot change the order!
        }
      }
      if (tp2.env && env) {
        // parse tp_env & merge to template
        const tp_env = tp2.env[env]
        if (typeof tp_env==='object' && tp_env!==null) {
          let parsed = startParsing(tp_env, ns, tp2)
          tp2 = merge(tp2, parsed)
        }
        if (xhr.runs && run) {
          const xh_runs = xhr.runs[run]
          if (typeof xh_runs==='object' && xh_runs!==null) {
            let parsed = startParsing(xh_runs, ns, tp2)
            tp2 = merge(tp2, parsed)
          }  
        }
      }
      if (tp2.select && slc) {
        // parse tp_slc & merge to template
        let xhr2 = {}
        for (const name of slc) {
          const tp_slc = tp2.select[name]
          if (typeof tp_slc==='object' && tp_slc!==null) {
            let parsed = startParsing(tp_slc, ns, tp2)
            xhr2 = merge(xhr2, parsed)
          }
        }
        if (xhr2.default) {
          if (!name.includes('_template_')) {
            xhr = merge(xhr2.default, xhr) //# donot change the order!
          }
          delete xhr2.default
        }
        tp2 = merge(tp2, xhr2)
      }
      if (xhr.runs && run) {
        const json = startParsing(xhr.runs, ns, tp2)
        const {runs, url, method, headers, body, validate, ...vars} = json[run]
        const obj = {url, method, headers, body, validate}
        const tgt = {}
        for (const id in obj) {
          obj[id]!==undefined && (tgt[id] = obj[id])
        }
        xhr = merge(xhr, tgt)
        tp2 = merge(tp2, vars)
      }
      // Parse request from template
      prs = startParsing(xhr, ns, tp2)
      xhr = merge(xhr, prs)
      if (url || headers || body) {
        xhr = merge(xhr, startParsing({url, headers, body}, ns, tp2, env))
      }
    }
    let xhr2 = {}
    const {url, method, headers, body, validate, ...vars} = xhr
    if (opt.var) {
      xhr2 = {...vars, validate, url, method, headers, body}  
    } else {
      xhr2 = {validate, url, method, headers, body}
    }
    return [ name.includes('_template_') ? xhr : xhr2, ori, src]
  }
}
module.exports = request
