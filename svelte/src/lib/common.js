import YAML from 'json-to-pretty-yaml';

export function pretty(json) {
  if (RPC._obj_?.argv?.json) {
    return JSON.stringify(json, null, 2)
  } else {
    return YAML.stringify(json)
  }
}