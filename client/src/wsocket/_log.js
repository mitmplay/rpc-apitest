async function log(aswait) {
  //# client code
  console.log(JSON.stringify(await aswait, null,2))
  return ''
}
module.exports = log