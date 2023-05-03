const xpath = require('./xpath')

let initToggle = 1

function md(_rpc_) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, c}
  } = _rpc_

  const broadcast = () => {}

  let timeout = false
  function initEnd() {
    if (initToggle) {
      _rpc_._mrkdown_ = {}
      console.log(c.magentaBright(`>>> Markdown watcher OK`))
      initToggle = 0
    }
  }
  function loadMD(path, msg) {
    let [app, typ, name] = xpath(path)
    if (!_rpc_[app]) {
      _rpc_[app] = {
        _mrkdown_: {},
        _openapi_: {},
        _request_: {},
      }
    } else if (!_rpc_[app]._openapi_) {
      _rpc_[app]._mrkdown_= {}
      _rpc_[app]._openapi_= {}
      _rpc_[app]._request_= {}
    }

    _rpc_[app]._mrkdown_[`${name}`] = {path}
    console.log(msg, JSON.stringify({app, typ, name}))
    if (!argv.test && initToggle) {
      timeout && clearTimeout(timeout)
      timeout = setTimeout(initEnd, 1000)
    }
  }

  function remove (path, msg) {
    console.log('remove Markdown file', path)
  }

  // Initialize watcher.
  const path = []
  const p = `${__app}/README.md`
  _rpc_._mrkdown_['_readme_'] = {path: p}
  if (_rpc_._obj_.argv.devmode) {
    path.push(`${__app}/RPC/*/docs/*.md`)
  }
  const rpath = argv.rpcpath || `${HOME}/user-rpc`
  path.push(`${rpath}/*/docs/*.md`)

  console.log(c.magentaBright(`>>> Markdown watcher:`), [tilde(path)])
  const uMDWatcher = chokidar.watch([path], {
    persistent: true
  })
  // Something to use when events are received.
  uMDWatcher // Add event listeners.
  .on('add',    _ => { _ = loadMD(_, 'add') })
  .on('change', _ => { _ = loadMD(_, 'chg') })
  .on('unlink', _ => { _ = remove(_, 'del') })
  _rpc_._watcher_.uMDWatcher = uMDWatcher
}
module.exports = md
