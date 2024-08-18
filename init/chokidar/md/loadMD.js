const xpath = require('../xpath')

function _loadMD(_rpc_, initToggle, initEnd) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, c}
  } = _rpc_
  
  function loadMD(path, msg) {
    let [app, typ, name] = xpath(path)
    if (!_rpc_[app]) {
      _rpc_[app] = {
        _mrkdown_: {},
        _openapi_: {},
        _request_: {},
      }
    } else if (!_rpc_[app]._openapi_) {
      _rpc_[app]._mrkdown_= {}
      _rpc_[app]._openapi_= {}
      _rpc_[app]._request_= {}
    }

    _rpc_[app]._mrkdown_[`${name}`] = {path}
    console.log(msg, JSON.stringify({app, typ, name}))
    if (!argv.test && initToggle.id) {
      initToggle.timeout && clearTimeout(initToggle.timeout)
      initToggle.timeout = setTimeout(initEnd, 1000)
    }
  }
  return loadMD;  
}
module.exports = _loadMD