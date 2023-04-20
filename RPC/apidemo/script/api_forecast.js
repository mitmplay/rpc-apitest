const env = require('./env')

async function forecast(all={}) {
  const {opt, ...oth} = {x_tag:'date', ...all}
  const {xhr, request_body: body} = env({apiname: 'forecast', opt})

  console.log(JSON.stringify({...xhr, body}, null, 2))
  xhr.body = JSON.stringify(body)
  const result = await rpc()._fn_.request(xhr, {
    senderIp: this.senderIp,
    api: 'forecast',
    act: '1.get',
    ...oth,
  })
  return result
}
module.exports = forecast
