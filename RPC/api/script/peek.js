async function peek(limit=25, path='') {
  // const _rpc_ = rpc()
  // const language = 'json'
  // const {_lib_: {hj}} = _rpc_
  const lparams = [...arguments].pop()
  if (lparams==='h') {
    return info()
  }

  const chain = rpc()._db_.logs('api_log').select ('*')
  path && chain.where('path', path)
  chain.orderBy('id', 'desc')
  
  let rows = await chain.limit(limit)
    
  const l = {}
  for(const row of rows) {
    // row.request  = hj.highlight(row.request,  {language}).value
    // row.response = hj.highlight(row.response, {language}).value
    l[`_${row.id}`] = row
  }
  return l
}

function info() {
return `
* console.log(await RPC.api_log.peek()) //# limit=10
* console.log(await RPC.api_log.peek(15))
`
}
module.exports = peek
