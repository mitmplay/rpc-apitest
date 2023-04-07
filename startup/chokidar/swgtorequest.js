const query_strings = require('./mocksgen/query_strings')
const _requestBody = require('./mocksgen/request_body')
const headers = {"Content-Type": "application/json"}

function swgtorequest(_rpc_) {
  function constructRequerst({swagger, nmspace, api}) {
    const {_request_} = _rpc_[nmspace]
    if (!_request_[api]) {
      _request_[api] = {}
    }

    function generateGetRequest(_urls, method) {
      const apis = _request_[api]
      for (const endpoint in _urls) {
        const urls = _urls[endpoint][method]
        if (!apis[endpoint]) {
          apis[endpoint] = {}
        }
        apis[endpoint][method] = []
        let id = 1
        for (const url of urls) {
          apis[endpoint][method].push({url, method, headers})
          id++  
        }  
      }
    }

    function generatePostRequest(_urls, method, schema) {
      const apis = _request_[api]
      for (const endpoint in _urls) {
        const urls = _urls[endpoint][method]
        if (!apis[endpoint]) {
          apis[endpoint] = {}
        }
        apis[endpoint][method] = []
        let id = 1
        for (const url of urls) {
          apis[endpoint][method].push({url, method, headers, schema})
          id++  
        }  
      }
    }

    for (const endpoint in swagger.paths) {
      const methods = swagger.paths[endpoint] 
      for (const method in methods) {
        const {requestBody, parameters=[]} = methods[method]
        const {content} = requestBody || {}
        let urls
        if (['get', 'delete'].includes(method)) {
          urls = query_strings(endpoint, method, parameters)
          generateGetRequest(urls, method)
        } else if (['post', 'put'].includes(method)) {
          urls = query_strings(endpoint, method, parameters)
          _requestBody(swagger, endpoint, method, schema => {
            generatePostRequest(urls, method, schema)
          })
        } else {
          console.log('Others', method)
        }
      }
    }
  }

  for (const nmspace in _rpc_) {
    const _YAML_ = _rpc_[nmspace]._YAML_
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
