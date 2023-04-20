const forecast = require('./_forecast')
const u_agent  = require('./_u_agent')
const yesno    = require('./_yesno')

const apis = {
  forecast,
  u_agent,
  yesno,
}

function env(_opt={}) {
  const {apiname, act, opt}= {
    apiname: 'yesno', 
    act: 'get', 
    opt: {},
   ..._opt
  }
  const {base_url, action} = apis[apiname]
  const {headers, method, path, body} = action[act]
  const apicall = {
    xhr: {
      url: `${base_url}${path(opt)}`,
      method,
      headers: {
        ...headers,
      },  
    },
  }
  if (body) {
    apicall.request_body = body
  }
  return apicall
}

module.exports = env
