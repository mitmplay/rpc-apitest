function checkMissingFields(payload, schemas, path, result) {
  for (const id in schemas) {
    const schemas2 = schemas[id]
    const payload2 = payload[id]
    if (path!=='.' && schemas2 && payload2===undefined) {
      result.missing_fields.push(`${path.slice(1)}${id}`)
      result.invalid = result.errid
    }
    if (schemas2!==null && typeof schemas2==='object') { // recursive 
      checkMissingFields(payload2, schemas2, `${path}${id}.`, result)
    }
  }
  return result
}

function checkUnknownFields(payload, schemas, path, result) {
  for (const id in payload) {
    const schemas2 = schemas[id]
    const payload2 = payload[id]
    if (path!=='.' && schemas2===undefined) {
      result.unknown_fields.push(`${path.slice(1)}${id}`)
      result.invalid = result.errid
    }
    if (schemas2!==null && typeof schemas2==='object') { // recursive 
      checkUnknownFields(payload2, schemas2, `${path}${id}.`, result)
    }
  }
  return result
}

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

  const json = {invalid: 0}
  if (reqs_schema) {
    const jreqs = {invalid: 0, missing_fields: [], unknown_fields: [], errid: 1}
    checkMissingFields(reqs, reqs_schema, '.', jreqs)
    checkUnknownFields(reqs, reqs_schema, '.', jreqs)
    if (jreqs.invalid) {
      json.invalid+= jreqs.invalid
      json.reqs    = jreqs
      delete jreqs.errid  
    }
  }

  if (resp_schema) {
    const resp = {headers: resp_hdr, body: resp_body}
    const jresp = {invalid: 0, missing_fields: [], unknown_fields: [], errid: 2}
    checkMissingFields(resp, resp_schema, '.', jresp)
    checkUnknownFields(resp, resp_schema, '.', jresp)
    if (jresp.invalid) {
      json.invalid+= jresp.invalid
      json.resp    = jresp
      delete jresp.errid  
    }
  }

  return json
}
module.exports = validate
