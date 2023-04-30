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

export function date({created,elapsed}, ln=5) {
  const dt = (new Date(created)).toISOString().replace(/\..+/,'')
  const str = ''+ Number(elapsed/1000).toFixed(2).padStart(ln, '0')
  return `${dt.replace(/.{5}/,'').replace('T','|')}|${str}`
}

export function req({request}, str) {
  const [c, m, u] = str.split(',')
  try {
    const o   = JSON.parse(request)
    const url = o[u].replace(/\?.+/,'...')
    return `${o[m]}${c}${url}`     
  } catch (error) {
    return ''
  }
}

export function resp({resp_hdr}) {
  const json = JSON.parse(resp_hdr) || {}
  const arr = ['report-to', 'nel']
  arr.forEach(el => {
    const data = json[el]
    if (data) {
      json[el] = JSON.parse(data)
    }
  });
  return JSON.stringify(json, null, 2)        
}
