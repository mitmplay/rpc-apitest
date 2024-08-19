const xpath = require('../xpath')

function _loadYAML(_rpc_, initToggle, initEnd) {
  const {
    _obj_: {HOME, argv},
    _fn_ : {tilde, _broadcast2},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_

  const broadcast = async (method) => {
    if (initToggle.id || !_broadcast2) {
      return
    }
    _broadcast2(method, '')
  }

  function loadYAML(path, msg) {
    let [app, typ, name] = xpath(path)
    name = name.replace(/\.yaml$/, '')
    if (!_rpc_[app]) {
      _rpc_[app] = {
        _mrkdown_: {},
        _openapi_: {},
        _request_: {},
        _request_src_: {},
      }
    } else if (!_rpc_[app]._openapi_) {
      _rpc_[app]._mrkdown_= {}
      _rpc_[app]._openapi_= {}
      _rpc_[app]._request_= {}
      _rpc_[app]._request_src_= {}
    }

    const str = fs.readFileSync(path, 'utf8')
    const obj = YAML.parse(str)
    if (obj===null) {
      if (path.includes('openapi')) {
        return
      }
    }
    if (_rpc_[app]._openapi_===undefined) {
      _rpc_[app]._openapi_ = {} 
    }
    if (obj?.openapi) {
      _rpc_[app]._openapi_[name] = obj
    } else {
      if (_rpc_[app]._request_src_===undefined) {
        _rpc_[app]._request_src_ = {} 
      }
      _rpc_[app]._request_[name] = obj || {}
      _rpc_[app]._request_src_[name] = str || ''
    }

    // const typ = obj.openapi ? 'openapi' : 'request'
    console.log(msg,  JSON.stringify({app, typ, name}))
    if (!argv.test) { 
      if (initToggle.id) {
        initToggle.timeout && clearTimeout(initToggle.timeout)
        initToggle.timeout = setTimeout(initEnd, 1000)
      }
      const method = `${typ}:${app}/${name}`
      broadcast(method, {})
    }
  }
  return loadYAML;
}
module.exports = _loadYAML