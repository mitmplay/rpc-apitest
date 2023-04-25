async function chance() {
  const {chance:c} = rpc()._lib_
  let arr = [...arguments]
  let fn = arr.shift()
  if (!fn) {
    fn = 'address'
  }
  return c[fn].apply(c, arr)
}
module.exports = chance
