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
const rgx_var0 = /hljs-attr">url:<\/span> <span class="(hljs-string)">&quot;\//
const rgx_var1 = /(hljs-string)">&quot;\//
const rgx_var2 = /(hljs[\w-]+)">(|&quot;|&#x27;){+[@\w&.:;~-]+}/g
const rgx_var3 = /(hljs-string)">.*undefined/g
const rgx_rsv1 = /(hljs-attr)">(api|env|select|default):/g
const rgx_rsv2 = /(hljs-attr)">(url|body|method|headers):/g
const rgx_rsv3 = /(hljs-attr)">(runs|validate|params):/g

export function showRequest(logOptions, {options}, nspace, json) {
  let _code = {}
  const {autoParsed, showHidden, showSource, showHeader} = options
  const {request, ori, src, run} = json[nspace]
  if (showSource) {
    _code = pretty(src || '', true)
  } else {
    let _tmp = (autoParsed ? request : ori)||{}
    if (showHidden) {
      _code = structuredClone(_tmp)
    } else {
      if (nspace==='_template_') {
        _code = _novar(structuredClone(_tmp))
      } else {
        const {validate, url, method, headers, body} = _tmp
        _code = structuredClone({validate, url, method, headers, body})
      }
    }
    if (!showHeader) {
      delete _code.headers;
    }
    _code = pretty(_code || '') //hljs-string">&quot;{
  }
  _code = _code.replace(/^\n/, '')
  _code = _code.replace(rgx_var2,   a=> `undefine ${a}`)
  _code = _code.replace(rgx_var3,   a=> `undefine ${a}`)
  if (_code.match(rgx_var0)) {
    _code = _code.replace(rgx_var1, a=> `undefine ${a}`)
  } else {
    _code = _code.replace(rgx_rsv1, a=> `rsvword1 ${a}`)
    _code = _code.replace(rgx_rsv2, a=> `rsvword2 ${a}`)
    _code = _code.replace(rgx_rsv3, a=> `rsvword3 ${a}`)  
  }
  if (logOptions.hideHost && autoParsed && !run.match('_template_')) {
    _code = _code.replace(/http(s|):\/\/[^/&]+/,'')
  }
  return _code
}