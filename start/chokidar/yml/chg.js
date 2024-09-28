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
        const templates = []
        const {_request_} = _rpc_[app]
        for (const row in _request_) {
          if (row.match(/^_[^_]+_$/) && row!=='_template_') {
            templates.push(row)
            // * merge non_template_ each section
            result = merge(result, _request_[row])
          }
        }
        const tpls = templates.join(', ')
        console.log(`${msg} merged: ${tpls} >> ${app}/_template_`)
        // * merge result into _template_
        _request_._template_ = merge(_request_._template_ori_,result)
      }
    }
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