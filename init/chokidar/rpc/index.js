const _path    = require('./path')
const _loadJS  = require('./loadJS')
const _remove  = require('./remove')
const _update  = require('./update')
const _initEnd = require('./initEnd')

let initToggle = {id:1}

function rpc(_rpc_) {
  initToggle.timeout = false

  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, fg, c}
  } = _rpc_

  const remove  = _remove (_rpc_, initToggle);
  const initEnd = _initEnd(_rpc_, initToggle);
  const loadJS  = _loadJS (_rpc_, initToggle, initEnd);
  const update  = _update  (_rpc_, initToggle, initEnd);

  // Initialize watcher.
  const path = _path(_rpc_)

  const ignored = /(\/index)\.js$/
  if (argv.test) {
    console.log(c.magentaBright(`>>> RPC loader:`), [tilde(path)])
    const arr = fg.sync([path], { dot: false })
    arr.forEach(_ =>{
      if (!ignored.test(_)) {
        loadJS(_, 'load')
      }
    })  
  } else {
    console.log(c.magentaBright(`>>> RPC watcher:`), [tilde(path)])
    const userRPCWatcher = chokidar.watch([path], {
      ignored, // ignore files
      persistent: true
    })

    userRPCWatcher // Add event listeners.
    .on('add',    fullpath => update(fullpath, 'add'))
    .on('change', fullpath => update(fullpath, 'chg'))
    .on('unlink', fullpath => remove(fullpath, 'del'))
    _rpc_._watcher_.userRPCWatcher = userRPCWatcher
  }
}
module.exports = rpc
