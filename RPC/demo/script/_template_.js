module.exports = $ => {
  const {chance} = rpc()._lib_
  return { // _template_.js
    first:  _ => chance.first(),
    last:   _ => chance.last(),
    number: _ => chance.integer({min: 1, max: 700}),
    dtnow:  _ => `${(new Date()).toISOString()}`,
    object: _ => ({lt: 1, gt: 10}),
  }
}
