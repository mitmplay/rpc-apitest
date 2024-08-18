const xpath = require('../xpath')

function _loadJS(_rpc_, initToggle, initEnd) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, fg, c}
  } = _rpc_

  function loadJS(path1, msg) {
    let [app, typ, rpc] = xpath(path1)
    rpc = rpc.replace('.js', '')

    delete require.cache[path1];
    const fn = require(path1)
    if (!_rpc_[app]) {
      _rpc_[app] = {}
    }

    _rpc_[app][rpc] = fn
    console.log(msg, JSON.stringify({app,rpc}))
    if (!argv.test && initToggle.id) {
      initToggle.timeout && clearTimeout(initToggle.timeout)
      initToggle.timeout = setTimeout(initEnd, 1000)
    }
  }
  return loadJS;  
}
module.exports = _loadJS