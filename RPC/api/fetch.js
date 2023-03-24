async function fetch(xhr, opt) {
  if (opt==='*') {
    opt = {}
  }
  const result = await global.RPC._fn_.request(xhr, {
    api: 'fetch',
    act: 'act',
    ...opt,
  })
  return result
}
module.exports = fetch
