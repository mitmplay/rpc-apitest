const xpath = require('../xpath')

function _chg(_rpc_, initToggle) {
  const {
    _obj_: {HOME, argv},
    _fn_ : {merge, _broadcast2},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_

  function chg(path, msg) {
    let obj
    const str = fs.readFileSync(path, 'utf8')
    if (path.includes('openapi')) {
      return
    } else {
      obj = YAML.parse(str)
      if (obj===null) {
        return
      }
    }
    let [app, typ, name] = xpath(path)
    name = name.replace(/\.yaml$/, '')
    if (obj?.openapi) {
      _rpc_[app]._openapi_[name] = obj
    } else {
      _rpc_[app]._request_[name] = obj || {}
      _rpc_[app]._request_src_[name] = str || ''
      const tpl = path.match(/\/_(\w+)_.yaml$/)
      if (tpl) { // for merging template
        let result = {}
        for (const key in _rpc_[app]) {
          const sec = _rpc_[app][key]
          // * merge non_template_ each section
          for (const path in sec) {
            if (path.match(/^_[^_]+_$/) && path!=='_template_') {
              result = merge(result, sec[path])
            }
          }
          // * merge result into _template_
          sec._template_ = merge(sec._template_ori_,result)
        }
      }
    }
    console.log(msg,  JSON.stringify({app, typ, name}))
    if (!argv.test) { 
      const method = `${typ}:${app}/${name}`
      console.log(c.magentaBright(`>>> broadcast add/chg file`))
      _broadcast2(method, {_act: msg})
      initToggle.id = 0
    }
  }
  return chg;  
}
module.exports = _chg