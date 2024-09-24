const _validate = require('./validate');

async function apilog(request, resp_hdr, response, opt={}) {
  const {
    host='', 
    api='', 
    act='', 
    path='',
    notes='', 
    x_tag='', 
    rspcode='', 
    senderIp='', 
    validate='',
    created=0
  } = opt
  
  const {body, ...reqs} = request
  const ts = Date.now()
  let elapsed = 0

  if (created) {
    elapsed = ts - created
  }
  if (body) {
    reqs.body = JSON.parse(body)
  }

  const payload = {
    host: host || senderIp,
    api,
    act,
    path,
    rspcode,
    request:  JSON.stringify(reqs, null, 2),
    resp_hdr: JSON.stringify(resp_hdr, null, 2),
    response: JSON.stringify(response, null, 2),
    notes,
    x_tag,
    created,
    updated: ts,
    elapsed,
    validate,
  }

  if (validate) {
    const json = _validate({reqs, rspcode, resp_hdr, resp_body: response, validate})
    validate.result = json
    payload.invalid = json.invalid
    payload.validate= JSON.stringify(validate, null, 2)
  }
  return await sql('api_log').insert(payload)  
}
module.exports = apilog
