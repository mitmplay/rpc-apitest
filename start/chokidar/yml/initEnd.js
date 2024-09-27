const swgtorequest = require('../swgtorequest')
const _rpc  = require('../../../_rpc_')

function _initEnd(_rpc_, initToggle) {
  const {
    _obj_: {HOME, argv},
    _fn_ : {merge, _broadcast2},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_
  
  function initEnd() {
    const {_tplcombine_} = _rpc_._obj_
    if (initToggle.id || _tplcombine_) {
      if (_tplcombine_) {
        const prepMerge = {}
        for (ns of _tplcombine_) {
          const app = ns.split('/')[0]
          // for merging template
          // * save obj namespace of section
          const sec = _rpc_[app]._request_
          if (prepMerge[ns]===undefined) {
            prepMerge[ns] = sec
          }
        }
        for (const key in prepMerge) {
          const sec = prepMerge[key]
          let result = {}
          // * merge non_template_ each section
          for (const path in sec) {
            if (path.match(/^_[^_]+_$/) && path!=='_template_') {
              result = merge(result, sec[path])
            }
          }
          // * merge result into _template_
          sec._template_ = merge(sec._template_ori_,result)
        }
        delete _rpc_._obj_._tplcombine_
      }
      console.log(c.magentaBright(`>>> YAML watcher OK`))
      initToggle.id = 0
      swgtorequest(_rpc_)
      _rpc(_rpc_)
    }
  }
  return initEnd;  
}
module.exports = _initEnd