function query_strings(parameters) {
  const urls = []

  function commonFunction(name, required) {
    if (!required) {
      urls.push('')
      urls.push(`${name}=`)
    }
  }

  const _array = ({name, required}) => {
    commonFunction(name, required)
    urls.push(`${name}=array`)
    urls.push(`${name}=array1&${name}=array2`)
  }
  
  const _string = ({name, required}) => {
    commonFunction(name, required)
    urls.push(`${name}=string`)
  }

  const _integer = ({name, required}) => {
    commonFunction(name, required)
    urls.push(`${name}=integer`)
  }

  _fn = {_array,_string,_integer}

  for (const param of parameters) {
    const {type} = param.schema
    const fn = _fn[`_${type}`]
    if (fn) {
      fn(param)
    } else {
      console.log({param})
    }
  }
  return urls
}
module.exports = query_strings

    // apis[`${api}_${id}`] =  {
    //   url: `${url}/1`,
    //   method,
    //   headers: {
    //     "Content-Type": "application/json",
    //   }
    // }