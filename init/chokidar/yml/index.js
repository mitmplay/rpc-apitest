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

  if (argv.test) {
    console.log(c.magentaBright(`>>> YAML loader:`), [tilde(path)])
    const arr = fg.sync([path], { dot: false })
    arr.forEach(fullpath =>{
      !/\/_.*\.yaml$/.test(fullpath) && loadYAML(fullpath, 'load')
    })  
  } else {
    console.log(c.magentaBright(`>>> YAML watcher:`), [tilde(path)])
    const userYMLWatcher = chokidar.watch([path], {
      ignored: /\/_.*\.js$/, // ignore files
      persistent: true
    })

    userYMLWatcher // Add event listeners.
    .on('add',    fullpath => update(fullpath, 'add'))
    .on('change', fullpath => update(fullpath, 'chg'))
    .on('unlink', fullpath => remove(fullpath, 'del'))
    _rpc_._watcher_.userYMLWatcher = userYMLWatcher
  }
}
module.exports = yml
