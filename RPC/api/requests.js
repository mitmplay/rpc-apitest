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
          run: `${app}/${path}`
        };
      }
      currentObj = currentObj[key];
    });
  }
  return result  
}

async function requests(plain=false) {
  const _rpc_ = fn()
  if (plain) {
    let requests1 = {}
    for (const app in _rpc_) {
      if (_rpc_[app]._request_) {
        requests1[app] = toTreeObj(app, _rpc_[app]._request_)
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
