const fn  = require('../_rpc_')

function ism() {
  let msg = ``
  const _rpc_ = fn()
  for (const k1 in _rpc_) {
    if (/^_.+_$/.test(k1)) {
      continue
    }
    msg += `window.RPC['${k1}'] = {\n`
    for (const k2 in _rpc_[k1]) {
      msg += `  async ${k2}() {
    const args = Array.prototype.slice.call(arguments);
    return await sendRequest('${k1}.${k2}', args)
  },
`
    }
    msg += '}\n'
  }
  msg += `window.RPC._obj_ = {}\n`
  msg += `window.RPC._obj_ = ${JSON.stringify(_rpc_._obj_)}\n`
  msg += `window.RPC._version_ = '${_rpc_._version_}'\n`
  return msg
}

module.exports = ism
