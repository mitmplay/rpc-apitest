const swgtorequest = require('../swgtorequest')
const _rpc  = require('../../../_rpc_')

function _initEnd(_rpc_, initToggle) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, fg, c}
  } = _rpc_
  
  function initEnd() {
    if (initToggle.id) {
      console.log(c.magentaBright(`>>> RPC watcher OK`))
      initToggle.id = 0
      _rpc(_rpc_)
    }
  }
  return initEnd;  
}
module.exports = _initEnd