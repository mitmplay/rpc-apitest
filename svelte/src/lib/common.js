import YAML from 'json-to-pretty-yaml';

export function pretty(json) {
  if (RPC._obj_?.argv?.yaml) {
    return YAML.stringify(json)
  } else {
    return JSON.stringify(json, null, 2)
  }
}