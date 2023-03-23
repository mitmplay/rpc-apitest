async function log(aswait) {
  console.log(JSON.stringify(await aswait, null,2))
  return ''
}
module.exports = log