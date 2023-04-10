const fn  = require('../../_rpc_')

function toTreeObj(app, paths) {
  const result = {};

  for (const path in paths) {
    const nestedKeys = path.split('/')
    let currentObj = result;
    nestedKeys.forEach((key, i) => {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      if (i === nestedKeys.length - 1) {
        currentObj[key] = {
          run: `${app}~${path}`
        };
      }
      currentObj = currentObj[key];
    });
  }
  return result  
}

async function mocks(plain=false) {
  const _rpc_ = fn()
  if (plain) {
    let requests = {}
    for (const app in _rpc_) {
      if (_rpc_[app]._request_) {
        requests[app] = toTreeObj(app, _rpc_[app]._request_)
      }
      // const _request_ = _rpc_[app]._request_ || {}
      // for (const apiname in _request_) {
      //   if (!requests[app]) {
      //     requests[app] = []
      //   }
      //   requests[app].push(`${app}~${apiname}`)
      // }
    }
    return requests
  
  } else {
    const epmocks = []
    for (const app in _rpc_) {
      const _request_ = _rpc_[app]._request_ || {}
      for (const apiname in _request_) {
        const paths = apiname.split('/')
        if (paths.length===1) {
          epmocks.push(`await RPC.api.fetch('${app}~${apiname}')`)
        }
      }
    }
    return JSON.stringify(epmocks.sort(), null, 2)  
  }
}
module.exports = mocks
