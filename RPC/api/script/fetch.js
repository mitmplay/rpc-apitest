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
async function fetch(path=def_req, opt={}, withLogs=false) {
  opt = {api:'fetch',act:'act',noLogs:true, ...opt}
  const {api, _fn_: {request}} = rpc()
  let xhr
  if (typeof path==='string') {
    if (is_openapi.test(path)) {
      xhr = await api.openapi(path, opt)
    } else {
      opt.path = path
      opt.withLogs = false
      const [parsed] = await api.request(path, opt)
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
  if (withLogs) {
    const logs = await api.peek(10, path)
    return [result, logs]
  } else {
    return result
  }
}
module.exports = fetch
