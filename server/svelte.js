const result = {}

function handler() {
  const {fn} = result
  fn.apply(this, arguments)
}

(async () => {
  const {handler} = await import('../svelte/build/handler.js')
  result.fn  = handler
})();

module.exports = handler
