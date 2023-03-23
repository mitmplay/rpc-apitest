const env = require('./env')

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
  const result = await global.RPC._fn_.request(xhr, {
    api: 'u_agent',
    act: '2.post',
    ...oth,
  })
  return result
}
module.exports = u_agent
