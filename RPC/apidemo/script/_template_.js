module.exports = $ => ({
  first: _ => rpc()._lib_.chance.first(),
  dtnow: _ => `{greet-ed} ${(new Date()).toISOString()}`,
})
