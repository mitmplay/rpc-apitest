async function peek(limit=25) {
  const _rpc_ = rpc()
  const language = 'json'
  const {_lib_: {hj}} = _rpc_
  const lparams = [...arguments].pop()
  if (lparams==='h') {
    return info()
  }
  let rows = await rpc()._db_.logs('api_log').
    select ('*').
    orderBy('id', 'desc').
    limit  (limit)
    
  const l = {}
  for(const row of rows) {
    row.request  = hj.highlight(row.request,  {language}).value
    row.response = hj.highlight(row.response, {language}).value
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
