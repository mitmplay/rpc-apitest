function merge(obj1, obj2) {
  if (Array.isArray(obj2)) {
    return JSON.parse(JSON.stringify(obj2))
  }

  let result = {};
  try {
    for (let key in obj1) {
      if (obj2.hasOwnProperty(key)) {
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
          result[key] = merge(obj1[key], obj2[key]);
        } else {
          result[key] = obj2[key];
        }
      } else {
        result[key] = obj1[key];
      }
    }
    
    for (let key in obj2) {
      if (!obj1.hasOwnProperty(key)) {
        result[key] = obj2[key];
      }
    }      
  } catch (error) {
    console.log(error)
  }
  return result;
}
module.exports = merge