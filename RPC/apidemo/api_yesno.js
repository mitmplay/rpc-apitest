const env = require('./env')

async function yesno(all={}) {
  const {opt, ...oth} = {x_tag:'x-request-id', ...all}
  const {xhr, request_body: body} = env({apiname: 'yesno', opt})

  console.log(JSON.stringify({...xhr, body}, null, 2))
  xhr.body = JSON.stringify(body)
  const result = await global.RPC._fn_.request(xhr, {
    api: 'yes/no',
    act: '1.get',
    ...oth,
  })
  return result
}
module.exports = yesno
