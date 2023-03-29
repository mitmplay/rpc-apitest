const generateUrls = require('./generate_urls')

function query_strings(baseUrl, parameters) {
  const mandatoryParameters = []
  const queryParameters = {}

  const _array   = _ => ['array1', 'array2']

  _fn = {_array}

  if (parameters) {
    if (parameters.length===1 && parameters[0].in==='path') {
      return [baseUrl]
    } 
    for (const param of parameters) {
      const {schema: {type}, name, required} = param
      if (param.in==='path') {
        continue
      }
      const fn = _fn[`_${type}`]
      queryParameters[name] = fn ? fn() : type
      required && mandatoryParameters.push(name)
    }
    return generateUrls(baseUrl, queryParameters, mandatoryParameters)  
  } else {
    return [baseUrl]
  }
}
module.exports = query_strings
