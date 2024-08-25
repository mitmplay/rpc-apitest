const swgtorequest = require('../swgtorequest')
const _rpc  = require('../../../_rpc_')

function _initEnd(_rpc_, initToggle) {
  const {
    _obj_: {HOME, argv},
    _fn_ : {tilde, _broadcast2},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_
  
  function initEnd() {
    if (initToggle.id) {
      console.log(c.magentaBright(`>>> YAML watcher OK`))
      initToggle.id = 0
      swgtorequest(_rpc_)
      _rpc(_rpc_)
    }
  }
  return initEnd;  
}
module.exports = _initEnd