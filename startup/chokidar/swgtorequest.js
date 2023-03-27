const query_strings = require('./mocksgen/query_strings')

function swgtorequest() {
  function constructRequerst({swagger, nmspace, api}) {
    const apis = {}
    let id = 1
    function generateRequest(url,method,arr) {
      for (const str of arr) {
        apis[`${api}_${id}`] =  {
          url: `${url}?${str}`,
          method,
          headers: {
            "Content-Type": "application/json",
          }
        }
        id++  
      }
    }
    for (const url in swagger.paths) {
      const methods = swagger.paths[url] 
      for (const method in methods) {
        const {parameters} = methods[method]
        if (parameters && method==='get') {
          const arr = query_strings(parameters)
          generateRequest(url,method,arr)
        }
      }
    }
    console.log(nmspace, JSON.stringify(apis, null, 2))
  }

  for (const nmspace in global.RPC) {
    const _YAML_ = global.RPC[nmspace]._YAML_
    if (_YAML_) {
      const apis = {}
      for (const api in _YAML_) {
        apis[api] = {}
        const obj = {
          swagger: _YAML_[api],
          nmspace,
          api
        }
        constructRequerst(obj)
      }
    }    
  }

}
module.exports = swgtorequest
