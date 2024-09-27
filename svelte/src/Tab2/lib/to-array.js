const template = /_\w+_$/
export function toArray(_json) {
    const arr1 = []
    const arr2 = []
    const arr3 = []
    for (const key in _json) {
      if (key.match(template)) {
        if (key==='_template_') {
          arr1.push(key)
        } 
      } else {
        if (_json[key].run) {
          arr3.push(key)
        } else if (!/^_/.test(key) ) {
          arr2.push(key)
        }
      }
    }
    const arr = [
      ...arr1.sort(),
      ...arr2.sort(),
      ...arr3.sort(),
    ]
    return arr
  }