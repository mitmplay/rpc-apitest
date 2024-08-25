const xpath = require('../xpath')

function _remove(_rpc_, initToggle) {
  const {
    _obj_: {HOME, argv},
    _fn_ : {tilde, _broadcast2},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_
  
  function remove(path, msg) {
    let [app, typ, name] = xpath(path)
    name = name.replace(/\.yaml$/, '')
    if (_rpc_[app]._openapi_[name]) {
      delete _rpc_[app]._openapi_[name]
    }
    if (_rpc_[app]._request_[name]) {
      delete _rpc_[app]._request_[name]
    }
    console.log(msg,  JSON.stringify({app, typ, name}))
    if (!argv.test) { 
      const method = `${typ}:${app}/${name}`
      console.log(c.magentaBright(`>>> broadcast delete file`))
      _broadcast2(method, {_act: 'del'})
      initToggle.id = 0
    }
  }
  return remove;  
}
module.exports = _remove