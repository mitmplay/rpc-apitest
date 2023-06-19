module.exports = $ => {
  const {chance} = rpc()._lib_
  const lt = chance.integer({min: 1,  max: 10})
  const gt = chance.integer({min: 10, max: 100})
  return { // _template_.js
    first:  _ => chance.first(),
    last:   _ => chance.last(),
    number: _ => chance.integer({min: 1, max: 700}),
    dtnow:  _ => `${(new Date()).toISOString()}`,
    object: _ => ({lt, gt}),
  }
}
