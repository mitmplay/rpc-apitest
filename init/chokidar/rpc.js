const xpath = require('./xpath')
const _rpc  = require('../../_rpc_')

let initToggle = 1

function rpc(_rpc_) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, fg, c}
  } = _rpc_

  const broadcast = () => {}

  let timeout = false
  function initEnd() {
    if (initToggle) {
      console.log(c.magentaBright(`>>> RPC watcher OK`))
      initToggle = 0
      _rpc(_rpc_)
    }
  }
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
    if (!argv.test && initToggle) {
      timeout && clearTimeout(timeout)
      timeout = setTimeout(initEnd, 1000)
    }
  }

  function updateJS (path, msg) {
    loadJS(path, msg, broadcast)
    timeout = setTimeout(initEnd, 1000)
    initToggle = 1
  }

  function remove (path, msg) {
    console.log('removeJS', path)
  }

  // Initialize watcher.
  const path = []
  if (_rpc_._obj_.argv.devmode) {
    path.push(`${__app}/RPC/*/script/*.js`)
  }
  const rpath = argv.rpcpath || `${HOME}/user-rpc`
  path.push(`${rpath}/*/script/*.js`)

  const ignored = /(\/index)\.js$/
  if (argv.test) {
    console.log(c.magentaBright(`>>> RPC loader:`), [tilde(path)])
    const arr = fg.sync([path], { dot: false })
    arr.forEach(_ =>{
      if (!ignored.test(_)) {
        loadJS(_, 'load', broadcast)
      }
    })  
  } else {
    console.log(c.magentaBright(`>>> RPC watcher:`), [tilde(path)])
    const userRPCWatcher = chokidar.watch([path], {
      ignored, // ignore files
      persistent: true
    })
    // Something to use when events are received.
    userRPCWatcher // Add event listeners.
    .on('add',    fullpath => updateJS(fullpath, 'add'))
    .on('change', fullpath => updateJS(fullpath, 'chg'))
    .on('unlink', fullpath => remove  (fullpath, 'del'))
    _rpc_._watcher_.userRPCWatcher = userRPCWatcher
  }
}
module.exports = rpc
