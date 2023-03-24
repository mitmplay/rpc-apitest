async function peek(limit=10) {
  const lparams = [...arguments].pop()
  if (lparams==='h') {
    return info()
  }
  let rows = await 
    RPC._db_.logs('api_log').
    select ('*').
    orderBy('id', 'desc').
    limit  (limit)
  return rows
}

function info() {
return `
* console.log(await RPC.api_log.peek()) //# limit=10
* console.log(await RPC.api_log.peek(15))
`
}
module.exports = peek
