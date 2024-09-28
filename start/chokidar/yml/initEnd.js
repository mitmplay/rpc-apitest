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
          if (prepMerge[app]===undefined) {
            prepMerge[app] = sec
          }
        }
        for (const app in prepMerge) {
          const sec = prepMerge[app]
          let result = {}
          const templates = []
          // * merge non_template_ each section
          for (const row in sec) {
            if (row.match(/^_[^_]+_$/) && row!=='_template_') {
              templates.push(row)
              // * merge non_template_ each section
              result = merge(result, sec[row])
            }
          }
          const tpls = templates.join(', ')
          console.log(`initEnd merged: ${tpls} >> ${app}/_template_`)
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