const env = require('./env')
const fn  = require('../../_rpc_')

async function yesno(all={}) {
  const {opt, ...oth} = {x_tag:'x-request-id', ...all}
  const {xhr, request_body: body} = env({apiname: 'yesno', opt})

  console.log(JSON.stringify({...xhr, body}, null, 2))
  xhr.body = JSON.stringify(body)
  const result = await fn()._fn_.request(xhr, {
    senderIp: this.senderIp,
    api: 'yes/no',
    act: '1.get',
    ...oth,
  })
  return result
}
module.exports = yesno
