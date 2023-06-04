function validate({reqs, rspcode, resp_hdr, resp_body, validate}) {
  const {request='', response=''} = validate
  let reqs_schema = request[reqs.method] || request
  let resp_schema = response[rspcode]    || response

  if (reqs_schema && typeof reqs_schema==='string') {
    reqs_schema = validate.schemas[reqs_schema]
  }

  if (resp_schema && typeof resp_schema==='string') {
    resp_schema = validate.schemas[resp_schema]
  }

  if (!reqs_schema && !resp_schema) {
    return {invalid: 0, err: []}
  }

  function checkMissingFields(payload, schemas, path, result) {
    for (const id in schemas) {
      const schemas2 = schemas[id]
      const payload2 = payload[id]
      if (schemas2 && payload2===undefined) {
        result.missing_fields.push(`${path.slice(1)}${id}`)
        result.invalid = result.errid
      }
      if (schemas2!==null && typeof schemas2==='object') { // recursive 
        checkMissingFields(payload2, schemas2, `${path}${id}.`, result)
      }
    }
    return result
  }

  const json = {invalid: 0}
  if (reqs_schema) {
    const jreqs = {invalid: 0, missing_fields: [], unknown_fields: [], errid: 1}
    const _reqs = checkMissingFields(reqs, reqs_schema, '.', jreqs)
    if (_reqs.invalid) {
      json.invalid+= _reqs.invalid
      json.reqs    = _reqs
      delete _reqs.errid  
    }
  }

  if (resp_schema) {
    const resp = {headers: resp_hdr, body: resp_body}
    const jresp = {invalid: 0, missing_fields: [], unknown_fields: [], errid: 2}
    const _resp = checkMissingFields(resp, resp_schema, '.', jresp)
    if (_resp.invalid) {
      json.invalid+= _resp.invalid
      json.resp    = _resp
      delete _resp.errid  
    }
  }

  return json
}
module.exports = validate
