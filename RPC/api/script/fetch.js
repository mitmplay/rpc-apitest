const is_openapi = /\w+\[\w+\]\//

def_req = {
  url: "https://yesno.wtf/api",
  method: "get",
  headers: {
    "Content-Type": "application/json"
  }
}

// modify request body & url
// opt.body = {...}, opt.url = '...'
async function fetch(xhr=def_req, opt={}) {
  opt = {api:'fetch',act:'act',...opt}
  const {api, _fn_: {request}} = rpc()
  if (typeof xhr==='string') {
    if (is_openapi.test(xhr)) {
      xhr = await api.openapi(xhr, opt)
    } else {
      const [parsed] = await api.request(xhr, opt)
      const {url, method, headers, body} = parsed
      xhr = {url, method, headers, body}
      opt.validate = parsed.validate
    }
  }
  opt.senderIp = this.senderIp
  if (xhr.body) {
    opt.url && (xhr.url = opt.url)
    opt.body && (xhr.body = opt.body)
  }
  delete opt.url
  delete opt.body
  const result = await request(xhr, opt)
  return result
}
module.exports = fetch
