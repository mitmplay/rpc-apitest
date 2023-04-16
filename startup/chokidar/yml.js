const swgtorequest = require('./swgtorequest')
const fn  = require('../../_rpc_')

let initToggle = 1
const rg1 = /\\/g
const rg2 = /\/(user-rpc|RPC)\/([\w-]+)\/(.+)\.yaml/

function yml(_rpc_) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_

  const broadcast = () => {}

  let timeout = false
  function initEnd() {
    if (initToggle) {
      console.log(c.magentaBright(`>>> YAML watcher OK`))
      initToggle = 0
      swgtorequest(_rpc_)
      fn(_rpc_)
    }
  }

  function loadYAML(path, msg) {
    let [app,name] = path.replace(rg1,'/').match(rg2).slice(2)
  
    if (!_rpc_[app]) {
      _rpc_[app] = {
        _YAML_   : {},
        _openapi_: {},
        _request_: {},
      }
    } else if (!_rpc_[app]._YAML_) {
      _rpc_[app]._YAML_   = {}
      _rpc_[app]._openapi_= {}
      _rpc_[app]._request_= {}
    }

    const str = fs.readFileSync(path, 'utf8')
    const obj = YAML.parse(str)
    if (obj.openapi) {
      _rpc_[app]._YAML_[name] = obj
    } else {
      _rpc_[app]._request_[name] = obj
    }

    console.log(msg,  JSON.stringify({app,yml}))
    if (!argv.test && initToggle) {
      timeout && clearTimeout(timeout)
      timeout = setTimeout(initEnd, 1000)
    }
  }

  function update(path, msg) {
    loadYAML(path, msg, broadcast)
    timeout = setTimeout(initEnd, 1000)
    initToggle = 1
  }

  function remove (path, msg) {
    console.log('removeYAML', path)
  }

  // Initialize watcher.
  const path = []
  if (_rpc_._obj_.argv.devmode) {
    path.push(`${__app}/RPC/**/*.yaml`)
  }
  path.push(`${HOME}/user-rpc/**/*.yaml`)

  if (argv.test) {
    console.log(c.magentaBright(`>>> YAML loader:`), [tilde(path)])
    const arr = fg.sync([path], { dot: false })
    arr.forEach(_ =>{
      !/\/_.*\.yaml$/.test(_) && loadYAML(_, 'load', broadcast)
    })  
  } else {
    console.log(c.magentaBright(`>>> YAML watcher:`), [tilde(path)])
    const uYMLWatcher = chokidar.watch([path], {
      ignored: /\/_.*\.js$/, // ignore files
      persistent: true
    })
    // Something to use when events are received.
    uYMLWatcher // Add event listeners.
    .on('add',    _ => { _ = update(_, 'add') })
    .on('change', _ => { _ = update(_, 'chg') })
    .on('unlink', _ => { _ = remove(_, 'del') })
    _rpc_._watcher_.uYMLWatcher = uYMLWatcher
  }
}
module.exports = yml
