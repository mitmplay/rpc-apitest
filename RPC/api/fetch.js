

async function fetch(xhr, opt) {
  const defOptions = {api: 'fetch', act: 'act'}
  if (opt==='*') {
    opt = defOptions
  } else {
    opt = {
      ...defOptions,
      ...opt,
    }  
  }
  if (typeof xhr==='string') {
    xhr = await global.RPC.api.openapi(xhr, opt)
  }
  opt.senderIp = this.senderIp
  const result = await global.RPC._fn_.request(xhr, opt)
  return result
}
module.exports = fetch
