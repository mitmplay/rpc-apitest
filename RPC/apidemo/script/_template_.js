module.exports = $ => {
  const {chance} = rpc()._lib_
  return { // _template_.js
    first: _ => chance.first(),
    xkcd:  _ => chance.integer({ min: 1, max: 700 }),
    dtnow: _ => `${(new Date()).toISOString()}`,
  }
}
