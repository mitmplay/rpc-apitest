const fn  = require('../../_rpc_')

async function request(req='apidemo/u_agent_post', opt={}) {
  const match = req.match(/^(\w+)\/([\w/]+)$/)
  const _rpc_ = fn()
  if (!match) {
    const errmsg = {error: `request: ${req} is not there!`}
    console.error(errmsg)
    return errmsg
  }
  const [p0, nmspace, name] = match
  if (_rpc_[nmspace]) {
    const xhr = _rpc_[nmspace]?._request_[name]
    return xhr
  }
}
module.exports = request
