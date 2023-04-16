function toTreeObj(app, paths, fn) {
  const result = {};

  for (const path in paths) {
    const nestedKeys = path.split('/')
    let currentObj = result;
    nestedKeys.forEach((key, i) => {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      if (i === nestedKeys.length - 1) {
        const fpath = `${app}/${path}`
        const run = fn && fn(paths, path) || fpath
        currentObj[key] = {run};
      }
      currentObj = currentObj[key];
    });
  }
  return result  
}
module.exports = toTreeObj