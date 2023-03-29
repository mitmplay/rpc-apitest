const query_strings = require('./mocksgen/query_strings')
const headers = {"Content-Type": "application/json"}

function swgtorequest() {
  function constructRequerst({swagger, nmspace, api}) {
    const apis = {}
    let id = 1
    
    function generateRequest(method, urls) {
      for (const url of urls) {
        apis[`${api}_${id}`] =  {url, method, headers}
        id++  
      }
    }

    for (const baseUrl in swagger.paths) {
      const methods = swagger.paths[baseUrl] 
      for (const method in methods) {
        const {parameters} = methods[method]
        if (parameters && method==='get') {
          const urls = query_strings(baseUrl, parameters)
          generateRequest(method, urls)
        }
      }
    }
    global.RPC[nmspace]._request_ = apis
    // console.log(nmspace, JSON.stringify(apis, null, 2))
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
