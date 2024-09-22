const _path    = require('./path')
const _loadMD  = require('./loadMD')
const _remove  = require('./remove')
const _initEnd = require('./initEnd')

const initToggle = {id:1}

function md(_rpc_) {
  initToggle.timeout = false

  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, c}
  } = _rpc_

  const remove  = _remove (_rpc_, initToggle);
  const initEnd = _initEnd(_rpc_, initToggle);
  const loadMD  = _loadMD (_rpc_, initToggle, initEnd);

  // Initialize watcher.
  const path = _path(_rpc_)
  const apth = Array.isArray(path) ? path : [path]

  console.log(c.magentaBright(`>>> Markdown watcher:`), [tilde(path)])
  const userMDWatcher = chokidar.watch(apth, {
    persistent: true
  })

  userMDWatcher // Add event listeners.
  .on('add',    fullpath => loadMD(fullpath, 'add'))
  .on('change', fullpath => loadMD(fullpath, 'chg'))
  .on('unlink', fullpath => remove(fullpath, 'del'))
  _rpc_._watcher_.userMDWatcher = userMDWatcher
}
module.exports = md
