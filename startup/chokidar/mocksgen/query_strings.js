const generateUrls = require('./generate_urls')

function query_strings(baseUrl, parameters) {
  const mandatoryParameters = []
  const queryParameters = {}

  const _array   = _ => ['array1', 'array2']
  const _string  = _ => 'string'
  const _integer = _ => 'integer'

  _fn = {_array,_string,_integer}

  for (const param of parameters) {
    const {schema, name, required} = param
    const fn = _fn[`_${schema.type}`]
    if (fn) {
      queryParameters[name] = fn()
      required && mandatoryParameters.push(name)
    } else {
      console.log({schema, name, required})
    }
  }
  return generateUrls(baseUrl, queryParameters, mandatoryParameters)
}
module.exports = query_strings
