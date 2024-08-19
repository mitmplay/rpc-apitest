async function remove(arr) {
  await rpc()._db_.logs('api_log').select('*').whereIn('id', arr).del()
  // let rows = await rpc()._db_.logs('api_log').select ('*')
  // return rows
}
module.exports = remove
