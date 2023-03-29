const generateUrls = require('./generate_urls')

function query_strings(baseUrl, method, parameters) {
  const mandatoryParameters = []
  const queryParameters = {}

  const _array   = _ => ['array1', 'array2']

  _fn = {_array}
  const result = {}
  result[baseUrl] = {}
  if (parameters.length) {
    if (parameters.length===1 && parameters[0].in==='path') {
      result[baseUrl][method] = [baseUrl]
    } else {
      for (const param of parameters) {
        const {schema: {type}, name, required} = param
        if (param.in==='path') {
          continue
        }
        const fn = _fn[`_${type}`]
        queryParameters[name] = fn ? fn() : type
        required && mandatoryParameters.push(name)
      }
      result[baseUrl][method] =  generateUrls(baseUrl, queryParameters, mandatoryParameters)  
    }
  } else {
    result[baseUrl][method] =  [baseUrl]
  }
  return result
}
module.exports = query_strings
