function _path(_rpc_) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, c}
  } = _rpc_

  const path = []
  const p = `${__app}/README.md`
  _rpc_._mrkdown_['_readme_'] = {path: p}
  if (_rpc_._obj_.argv.devmode) {
    path.push(`${__app}/RPC/*/docs/*.md`)
  }
  const rpath = argv.rpcpath || `${HOME}/user-rpc`
  path.push(`${rpath}/*/docs/*.md`)

  return path;  
}
module.exports = _path