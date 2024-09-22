const _chg      = require('./chg')
const _path     = require('./path')
const _remove   = require('./remove')
const _update   = require('./update')
const _initEnd  = require('./initEnd')
const _loadYAML = require('./loadYAML')

const initToggle = {id:1}

function yml(_rpc_) {
  initToggle.timeout = false

  const {
    _obj_: {HOME, argv},
    _fn_ : {tilde, _broadcast2},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_

  const chg      = _chg     (_rpc_, initToggle);
  const remove   = _remove  (_rpc_, initToggle);
  const initEnd  = _initEnd (_rpc_, initToggle);
  const loadYAML = _loadYAML(_rpc_, initToggle, initEnd);
  const update   = _update  (_rpc_, initToggle, initEnd, chg, loadYAML);

  // Initialize watcher.
  const path = _path(_rpc_)
  const apth = Array.isArray(path) ? path : [path]

  const ignored = /(\/_.*\.js|\.DS_Store)$/
  let ns
  if (argv.test) {
    ns = argv.test.split('@')[1]
  }

  if (argv.test) {
    console.log(c.magentaBright(`>>> YAML loader:`), [tilde(path)])
    const arr = fg.sync(apth, { dot: false })
    arr.forEach(fullpath =>{
      const fp = fullpath.split('/')
      const yaml = fp.includes(ns)
      if (yaml && !ignored.test(fullpath)) {
        loadYAML(fullpath, 'load')
      }
    })  
  } else {
    console.log(c.magentaBright(`>>> YAML watcher:`), [tilde(path)])
    const userYMLWatcher = chokidar.watch(apth, {
      ignored, // ignore files
      persistent: true
    })

    userYMLWatcher // Add event listeners.
    .on('add'      , fullpath => update(fullpath, 'add'))
    .on('addDir'   , fullpath => update(fullpath, 'add', false))
    .on('unlink'   , fullpath => remove(fullpath, 'del'))    
    .on('unlinkDir', fullpath => remove(fullpath, 'del', false))
    .on('change'   , fullpath => update(fullpath, 'chg'))
    _rpc_._watcher_.userYMLWatcher = userYMLWatcher
  }
}
module.exports = yml
