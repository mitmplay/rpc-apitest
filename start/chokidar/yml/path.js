function _path(_rpc_) {
  const {
    _obj_: {HOME, argv},
    _fn_ : {tilde, _broadcast2},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_

  const path = []
  if (_rpc_._obj_.argv.devmode) {
    path.push(`${__app}/RPC/*/request/**/*.yaml`)
    path.push(`${__app}/RPC/*/openapi/**/*.yaml`)
  }
  const rpath = argv.rpcpath || `${HOME}/user-rpc`
  path.push(`${rpath}/*/request/**/*.yaml`)
  path.push(`${rpath}/*/openapi/**/*.yaml`)

  return path;  
}
module.exports = _path