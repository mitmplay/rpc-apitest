function _remove(_rpc_, initToggle) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, fg, c}
  } = _rpc_
  
  function remove (path, msg) {
    console.log('removeJS', path)
  }
  return remove;  
}
module.exports = _remove