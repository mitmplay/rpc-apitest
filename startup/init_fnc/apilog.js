async function apilog(request, resp_hdr, response, {api='', act='', notes='', rspcode='', x_tag='', created=0}) {
  const {body, ...reqs} = request
  const ts = Date.now()
  let elapsed = 0
  if (created) {
    elapsed = ts - created
  }
  if (body) {
    reqs.body = JSON.parse(body)
  }
  await sql('api_log').insert({
    api,
    act,
    rspcode,
    request:  JSON.stringify(reqs, null, 2),
    resp_hdr: JSON.stringify(resp_hdr, null, 2),
    response: JSON.stringify(response, null, 2),
    notes,
    x_tag,
    created,
    updated: ts,
    elapsed,
  })  
}
module.exports = apilog
