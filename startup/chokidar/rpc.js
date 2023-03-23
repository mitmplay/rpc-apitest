let initToggle = 1

function rpc() {
  const {
    _fn_ : {tilde, p},
    _obj_: {HOME, argv},
    _lib_: {chokidar, fg, c}
  } = global.RPC

  const broadcast = () => {}

  let timeout = false
  function initEnd() {
    if (initToggle) {
      console.log(c.magentaBright(`>>> RPC watcher OK`))
      initToggle = 0
    }
  }
  function loadJS(path, msg) {
    let [app,rpc] = path.split('/').slice(-2)
    rpc = rpc.replace('.js', '')

    const fn = require(path)
    if (!global.RPC[app]) {
      global.RPC[app] = {}
    }

    global.RPC[app][rpc] = fn
    console.log(msg, {app,rpc})
    if (!argv.test && initToggle) {
      timeout && clearTimeout(timeout)
      timeout = setTimeout(initEnd, 1000)
    }
  }

  loadJS.remove = function(path, msg) {
    console.log('removeJS', path)
  }

  function updateJS (path, msg) {
    loadJS(path, msg, broadcast)
  }

  function remove (path, msg) {
    loadJS.remove(path, msg, broadcast)
  }

  // Initialize watcher.
  const path = `${HOME}/user-rpc/*/*.js`
  if (argv.test) {
    return () => {
      console.log(c.magentaBright(`>>> RPC loader:`), [tilde(path)])
      const arr = fg.sync([path], { dot: false })
      arr.forEach(_ =>{
        !/\/_.*\.js$/.test(_) && loadJS(_, 'load', broadcast)
      })  
    }
  } else {
    return () => {
      console.log(c.magentaBright(`>>> RPC watcher:`), [tilde(path)])
      const uRPCWatcher = chokidar.watch([path], {
        ignored: /\/_.*\.js$/, // ignore files
        persistent: true
      })
      // Something to use when events are received.
      uRPCWatcher // Add event listeners.
      .on('add',    _ => { _ = updateJS(_, 'add') })
      .on('change', _ => { _ = updateJS(_, 'chg') })
      .on('unlink', _ => { _ =   remove(_, 'del') })
      global.RPC._watcher_.uRPCWatcher = uRPCWatcher
    }
  }
}
module.exports = rpc
