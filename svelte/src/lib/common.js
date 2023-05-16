import YAML from 'json-to-pretty-yaml';

export function pretty(json, src=false) {
  let str
  if (src) {
    str = hljs.highlight(json, {language: 'yaml'}).value
  } else {
    if (RPC._obj_?.argv?.json) {
      str = JSON.stringify(json, null, 2)
      str = hljs.highlight(str, {language: 'json'}).value
    } else {
      str = YAML.stringify(json)
      str = hljs.highlight(str, {language: 'yaml'}).value
    }  
  }
  return str
}

export function toJson(str) {
  const language = 'json'
  str = hljs.highlight(str, {language}).value
  return str
}

export function toYaml(str) {
  try {
    const language = 'yaml'
    str = YAML.stringify(JSON.parse(str))
    str = hljs.highlight(str, {language}).value      
    return str
  } catch (error) {
    return str    
  }
}
