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
    }
  }
  function loadJS(path1, msg) {
    const path2 = path1.replace(/\\/g, '/')
    let [app,rpc] = path2.split('/').slice(-2)
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
    path.push(`${__app}/RPC/*/*.js`)
  }
  path.push(`${HOME}/user-rpc/*/*.js`)

  const ignored = /(\/_.*|index)\.js$/
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
    const uRPCWatcher = chokidar.watch([path], {
      ignored, // ignore files
      persistent: true
    })
    // Something to use when events are received.
    uRPCWatcher // Add event listeners.
    .on('add',    _ => { _ = updateJS(_, 'add') })
    .on('change', _ => { _ = updateJS(_, 'chg') })
    .on('unlink', _ => { _ =   remove(_, 'del') })
    _rpc_._watcher_.uRPCWatcher = uRPCWatcher
  }
}
module.exports = rpc
