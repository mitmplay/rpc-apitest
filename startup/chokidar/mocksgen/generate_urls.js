function generateUrls(baseUrl, queryParameters, mandatoryParameters) {
  let urls = []
  let params = Object.keys(queryParameters).filter(key => !!queryParameters[key])

  for (let i = 1; i <= params.length; i++) {
    const combinations = getCombinationsWithoutRepetition(params, i)
    for (let j = 0; j < combinations.length; j++) {
      const combination = combinations[j]
      const queryParams = {}
      let hasMandatoryParams = true

      for (let k = 0; k < combination.length; k++) {
        const param = combination[k]
        queryParams[param] = queryParameters[param]

        if (mandatoryParameters.indexOf(param) >= 0) {
          hasMandatoryParams = true
        }
      }

      for (let l = 0; l < mandatoryParameters.length; l++) {
        const mandatoryParam = mandatoryParameters[l]

        if (queryParams[mandatoryParam] === undefined) {
          hasMandatoryParams = false
          break
        }
      }

      if (hasMandatoryParams) {
        urls.push(baseUrl + "?" + Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join("&"))
      }
    }
  }

  return urls
}

function getCombinationsWithoutRepetition(arr, len) {
  if (len === 1) {
    return arr.map(item => [item])
  }

  let combinations = []

  for (let i = 0; i < arr.length; i++) {
    const remaining = arr.slice(i + 1)
    const innerCombinations = getCombinationsWithoutRepetition(remaining, len - 1)

    for (let j = 0; j < innerCombinations.length; j++) {
      const combination = [arr[i], ...innerCombinations[j]]
      combinations.push(combination)
    }
  }

  return combinations
}
module.exports = generateUrls

// const baseUrl = "http://example.com"
// const queryParameters = {
//   param1: "value",
//   param2: "value",
//   param3: "value"
// }
// const mandatoryParameters = ["param3"]

// const urls = generateUrls(baseUrl, queryParameters, mandatoryParameters)

// console.log(urls)
