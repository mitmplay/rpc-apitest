function _update(_rpc_, initToggle, initEnd, chg, loadYAML) {
  const {
    _obj_: {HOME, argv},
    _fn_ : {tilde, _broadcast2},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_
  
  function update(path, msg, file=true) {
    if (file) {
      if (initToggle.id) {
        loadYAML(path, msg)
        initToggle.timeout = setTimeout(initEnd, 1000)
        return
      }
      chg(path, msg)  
    }
  }
  return update;  
}
module.exports = _update