const swgtorequest = require('../swgtorequest')
const _rpc  = require('../../../_rpc_')

function _initEnd(_rpc_, initToggle) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, c}
  } = _rpc_
  
  function initEnd() {
    if (initToggle.id) {
      _rpc_._mrkdown_ = {}
      console.log(c.magentaBright(`>>> Markdown watcher OK`))
      initToggle.id = 0
    }
  }
  return initEnd;  
}
module.exports = _initEnd