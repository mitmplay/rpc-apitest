async function log(asWait) {
  console.log(JSON.stringify(await asWait, null,2))
  return ''
}
module.exports = log