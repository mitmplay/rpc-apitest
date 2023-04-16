let _home
const { platform, env: { HOME, HOMEPATH } } = process
if (platform === 'win32') {
  _home = HOMEPATH.replace(/\\/g, '/')
  if (!_home.match(/^[^:]:/)) {
    _home = `${process.env.HOMEDRIVE}${_home}`
  }
} else {
  _home = HOME
}
const _win32 = platform === 'win32'

function tilde (path) {
  if (Array.isArray(path)) {
    return path.forEach(v=>v.replace(new RegExp(_home, 'g'), '~'))
  } else {
    return path.replace(new RegExp(_home, 'g'), '~')
  }
}

function home (path) {
  if (Array.isArray(path)) {
    return path.forEach(v=>v.replace(/^[ \t]*~/, _home))
  } else {
    return path.replace(/^[ \t]*~/, _home)
  }
}

const p = _ => tilde(_.replace(/\\/g, '/'))

module.exports = {
  _win32,
  _home,
  tilde,
  home,
  p,
}
