export function no1({id}, ln=3) {
  id = ''+ id 
  return id.padStart(ln, ' ')
}

export function date({created,elapsed}, ln=5) {
  const dt = (new Date(created)).toISOString().replace(/\..+/,'')
  const str = ''+ Number(elapsed/1000).toFixed(2).padStart(ln, '0')
  return `${dt.replace(/.{5}/,'').replace('T','|')}|${str}`
}

export function meth({request}) {
  try {
    return JSON.parse(request).method    
  } catch (error) {
    return ''
  }
}

export function resp({resp_hdr}) {
  if (resp_hdr) {
    const json = JSON.parse(resp_hdr)
    const arr = ['report-to', 'nel']
    arr.forEach(el => {
      const data = json[el]
      if (data) {
        json[el] = JSON.parse(data)
      }
    });
    return JSON.stringify(json, null, 2)        
  }
}

export function trunc(str) {
  return str.replace(/^{\n/, '')
}