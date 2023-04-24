console.log('Start:')
const YAML= require('yaml')
const fs  = require('fs-extra')
const fg  = require('fast-glob')
const Chance = require('chance')
const c   = require('ansi-colors')
const chokidar = require('chokidar')
const jsfaker = require('json-schema-faker');
const dir = __dirname.replace(/\\/g, '/').split('/')
const container = require('markdown-it-container')
const anchor = require('markdown-it-anchor')
const hj = require('highlight.js');
const md = require('markdown-it')({
  html: true,
  linkify: true,
  highlight: function (code, language) {
    if (language && hj.getLanguage(language)) {
      try {
        return hj.highlight(code, {language, ignoreIllegals: true }).value
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
});
md.use(anchor);
md.use(container, 'summary', {
  validate: function(params) {
    return params.trim().match(/^summary\s+(.*)$/);
  },

  render: function (tokens, idx) {
    var m = tokens[idx].info.trim().match(/^summary\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      return `<div class="details" title="${md.renderInline(m[1])}">\n`;
    } else {
      // closing tag
      return '</div>\n';
    }
  }
});

global.__app = dir.slice(0, -1).join('/')
console.log(c.yellow(`App Path: ${global.__app}`))

function init_lib(_rpc_) {
  const {argv}  = process
  console.log(c.yellow(`Argv as seen from NodeJS`), argv.map(x=>x.replace(/\\/g, '/')))

  const {_lib_, _obj_} = _rpc_
  _lib_.c  = c
  _lib_.md = md
  _lib_.fs = fs
  _lib_.fg = fg
  _lib_.YAML = YAML
  _lib_.jsfaker = jsfaker
  _lib_.chokidar = chokidar
  _lib_.chance = new Chance()
  import('open').then(async m => {
    _lib_.open = m.default
    if (_obj_.argv.open && !_obj_.argv.test) {
      if (!_obj_.argv.https) {
        await _lib_.open('http://localhost:3001')
      } else {
        await _lib_.open('https://localhost:3002')
      }
    } 
  })
}

module.exports = init_lib
