async function code(nspace='api', name='code') {
  const _rpc_ = rpc()
  const language = 'js'
  const {_lib_: {hj}} = _rpc_
  const str = _rpc_[nspace][name]+''
  const html = hj.highlight(str, {language}).value
  return html
}
module.exports = code
