function _update(_rpc_, initToggle, initEnd, loadJS) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, fg, c}
  } = _rpc_
  
  const broadcast = () => {}

  function update(path, msg) {
    loadJS(path, msg, broadcast)
    initToggle.timeout = setTimeout(initEnd, 1000)
    initToggle.id = 1
  }
  return update;
}
module.exports = _update