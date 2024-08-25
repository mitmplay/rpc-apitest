function nanoid(size = 8) {
  let id = ''
  while (size-- > 0) {
    id += t64[Math.random() * 64 | 0]
  }
  return id
}
module.exports = nanoid
