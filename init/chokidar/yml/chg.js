function _chg(_rpc_, initToggle) {
  const {
    _obj_: {HOME, argv},
    _fn_ : {tilde, _broadcast2},
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