import { pretty } from '../../lib/common';

function _novar(_ori_, _init_='^') {
  const showvar = ['^.headers','^.body']
  const _deepno = (_ori, _up) => {
    const fvar = x=>x===_up.slice(0,x.length)
    for (const key in _ori) {
      const arr = showvar.filter(fvar)
      if (key[0]==='_' && !arr.length) {
        // console.log({_up, key})
        delete _ori[key]
      } else if (typeof _ori[key]==='object') {
        if (_ori[key]!==null || !Array.isArray(_ori[key])) {
          _deepno(_ori[key], `${_up}.${key}`)
        }
      }
    }
  }
  _deepno(_ori_, _init_)
  return _ori_
}

const rgx_var1 = /(hljs-string)">&(quot|#x27);{[\w&.:;-]+}/g
const rgx_var2 = /(hljs-string)">.*undefined/g
const rgx_rsv1 = /(hljs-attr)">(env|select|default):/g
const rgx_rsv2 = /(hljs-attr)">(url|body|method|headers):/g
const rgx_rsv3 = /(hljs-attr)">(runs|validate):/g

export function showRequest({options}, nspace, json) {
  let _code = {}
  const {autoParsed, showRvar, showSrc} = options
  const {request, ori, src} = json[nspace]
  if (showSrc) {
    _code = pretty(src || '', true)
  } else {
    let _tmp = (autoParsed ? request : ori)||{}
    if (showRvar) {
      _code = _tmp
    } else if (nspace==='_template_') {
      _code = _novar(JSON.parse(JSON.stringify(_tmp)))
    } else {
      const {validate, url, method, headers, body} = _tmp
      _code = {validate, url, method, headers, body}
    }
    _code = pretty(_code || '') //hljs-string">&quot;{
  }
  _code = _code.replace(rgx_var1, p1=> `undefine ${p1}`)
  _code = _code.replace(rgx_var2, p1=> `undefine ${p1}`)
  _code = _code.replace(rgx_rsv1, p1=> `rsvword1 ${p1}`)
  _code = _code.replace(rgx_rsv2, p1=> `rsvword2 ${p1}`)
  _code = _code.replace(rgx_rsv3, p1=> `rsvword3 ${p1}`)
  return _code
}