import YAML from 'json-to-pretty-yaml';

export function pretty(json) {
  let str
  if (RPC._obj_?.argv?.json) {
    const language = 'json'
    str = JSON.stringify(json, null, 2)
    str = hljs.highlight(str, {language: 'json'}).value
  } else {
    const language = 'yaml'
    str = YAML.stringify(json)
    str = hljs.highlight(str, {language: 'yaml'}).value
  }
  return str
}