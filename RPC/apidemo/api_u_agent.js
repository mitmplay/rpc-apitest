const env = require('./env')
const fn  = require('../../_rpc_')

async function u_agent(all={}) {
  let {opt, body, ...oth} = {x_tag:'x-request-id', ...all}
  const {xhr, request_body} = env({
    apiname: 'u_agent',
    act: 'post',
    opt
  })
  if (body===undefined) {
    body = request_body
  }

  console.log(JSON.stringify({...xhr, body}, null, 2))
  xhr.body = JSON.stringify(body)
  const result = await fn()._fn_.request(xhr, {
    senderIp: this.senderIp,
    api: 'u_agent',
    act: '2.post',
    ...oth,
  })
  return result
}
module.exports = u_agent
