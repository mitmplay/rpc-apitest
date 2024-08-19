const peek = require('./peek')

async function remove(arr) {
  const row = await rpc()._db_.logs('api_log').select('*').whereIn('id', arr).delete()
  console.log('deleted:', row)
  const l = await peek();
  return l
}
module.exports = remove
