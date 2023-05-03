const is_openapi = /\w+\[\w+\]\//

def_req = {
  url: "https://yesno.wtf/api",
  method: "get",
  headers: {
    "Content-Type": "application/json"
  }
}

async function fetch(xhr=def_req, opt) {
  opt = {api:'fetch',act:'act',...opt}
  const {api, _fn_: {request}} = rpc()
  if (typeof xhr==='string') {
    if (is_openapi.test(xhr)) {
      xhr = await api.openapi(xhr, opt)
    } else {
      const [parsed] = await api.request(xhr, opt)
      xhr = parsed
    }
  }
  opt.senderIp = this.senderIp
  const result = await request(xhr, opt)
  return result
}
module.exports = fetch
