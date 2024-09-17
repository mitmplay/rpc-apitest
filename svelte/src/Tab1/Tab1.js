export function toArray(json) {
  const l = []
  for(const id in json) {
    json[id]._id = id
    l.push(json[id])
  }
  return l
}

export function no1({id}, ln=3) {
  id = ''+ id 
  return id.padStart(ln, ' ')
}

export function sortID(a,b) {
  if (a.id < b.id) return -1;    
  if (a.id > b.id) return 1;
  return 0;
}

export function date({created}) {
  const dt = (new Date(created)).toISOString().replace(/\..+/,'')
  return `${dt.replace(/.{5}/,'').replace('T','|')}`
}

export function elapse({elapsed}, ln=5) {
  const str = ''+ Number(elapsed/1000).toFixed(2).padStart(ln, '0')
  return `${str}`
}

const _m = {
  get      : 'get ',
  put      : 'put ',
  post     : 'post',
  delete   : 'del ',
  head     : 'head',
  trace    : 'trac',
  patch    : 'patc',
  connect  : 'conn',
  options  : 'optn',
  undefined: '....',
}
export function req({request}, str, {hideHost:h}) {
  const [c, m, u] = str.split(',')
  try {
    const o   = JSON.parse(request)
    const url = o[u].replace(/\?.+/,'...')
    return `${_m[o[m]]}${c}${h?url.replace(/^https:\/\/[^\/]+/,''):url}`
  } catch (error) {
    return ''
  }
}

export function resp({resp_hdr, elapsed}) {
  const json = JSON.parse(resp_hdr) || {}
  const arr = ['report-to', 'nel']
  arr.forEach(el => {
    const data = json[el]
    if (data) {
      json[el] = JSON.parse(data)
    }
  });
  json.elapsed = elapsed
  const result = JSON.stringify(json, null, 2)
  return result
}
