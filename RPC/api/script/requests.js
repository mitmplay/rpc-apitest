async function requests(plain=false) {
  const _rpc_ = rpc()
  if (plain) {
    let requests1 = {}
    for (const app in _rpc_) {
      if (_rpc_[app]._request_) {
        const obj = _rpc_._fn_.toTreeObj(app, _rpc_[app]._request_)
        const {_template_: t} = obj
        if (t) {
          const [xhr, ori, src] = await _rpc_.api.request(`${app}/_template_`)
          const envs = Object.keys(ori?.env||{dev:''})
          obj._template_ = {...t, xhr, ori, src, envs}
        }
        requests1[app] = obj
      }
    }
    return requests1
  
  } else {
    const requests2 = []
    for (const app in _rpc_) {
      const _request_ = _rpc_[app]._request_ || {}
      for (const apiname in _request_) {
        if (!/_template_/.test(apiname)) {
          requests2.push(`await RPC.api.fetch('${app}/${apiname}')`)
        }
      }
    }
    return JSON.stringify(requests2.sort(), null, 2)  
  }
}
module.exports = requests
