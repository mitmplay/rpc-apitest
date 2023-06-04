
function validate({reqs, rspcode, resp_hdr, response, validate}) {
  const {before_call='', after_call=''} = validate
  let reqs_schema = before_call[reqs.method] || before_call
  let resp_schema = after_call[rspcode]      || after_call

  if (reqs_schema && typeof reqs_schema==='string') {
    reqs_schema = validate.schemas[reqs_schema]
  }

  if (resp_schema && typeof resp_schema==='string') {
    resp_schema = validate.schemas[resp_schema]
  }

  if (!reqs_schema && !resp_schema) {
    return {invalid: 0, err: []}
  }

  function checkSchema(payload, schemas, path, result) {
    for (const id in schemas) {
      const schemas2 = schemas[id]
      const payload2 = payload[id]
      if (schemas2 && payload2===undefined) {
        result.err.push(`${path}${id}`)
        result.invalid = result.errid
      }
      if (schemas2!==null && typeof schemas2==='object') { // recursive 
        checkSchema(payload2, schemas2, `${path}${id}.`, result)
      }
    }
    return result
  }

  const json = {invalid: 0}
  if (reqs_schema) {
    const jreqs  = {invalid: 0, err: [], errid: 1}
    const _reqs  = checkSchema(reqs, reqs_schema, '.', jreqs)
    json.invalid+= _reqs.invalid
    json.reqs    = _reqs
    delete _reqs.errid
  }

  if (resp_schema) {
    const jresp  = {invalid: 0, err: [], errid: 2}
    const _resp  = checkSchema(response, resp_schema, '.', jresp)
    json.invalid+= _resp.invalid
    json.resp    = _resp
    delete _resp.errid
  }

  return json
}
module.exports = validate