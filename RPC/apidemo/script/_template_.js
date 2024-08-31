module.exports = $ => {
  const {chance, datefns} = rpc()._lib_
  return { // _template_.js
    last:  _ => chance.last(),
    first: _ => chance.first(),
    dtnow: _ => `${(new Date()).toISOString()}`,
    xkcd:  _ => chance.integer({ min: 1, max: 700 }),
    today: _ => `${datefns.format(new Date(), "'Today is a' eeee")}`,
    json:  _ => {
      return {
        lt: 1,
        gt: 10
      }
    }
  }
}
