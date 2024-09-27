const xpath = require('../xpath')
function _update(_rpc_, initToggle, initEnd, chg, loadYAML) {
  const {
    _obj_,
    _fn_ : {tilde, _broadcast2},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_
  
  function update(path, msg, file=true) {
    if (file) {
      let [app, typ, name] = xpath(path)
      name = name.replace(/\.yaml$/, '')
      const tpl = name.match(/_(\w+)_$/)
      const tpl2 = (tpl && tpl[1]!=='template')
      if (initToggle.id || tpl2) {
        loadYAML(path, msg)
        if (tpl2) { // for merging template
          if (_obj_._tplcombine_===undefined) {
              _obj_._tplcombine_ = []
              _obj_._tplcombine_.push(`${app}/${name}`)
          }
        }
        initToggle.timeout = setTimeout(initEnd, 1000)
        return
      }
      chg(path, msg)  
    }
  }
  return update;  
}
module.exports = _update