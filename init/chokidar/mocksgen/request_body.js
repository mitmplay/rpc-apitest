const $RefParser = require('@apidevtools/json-schema-ref-parser');

function requestBody(spec, endpoint, method, fn) {
  const specmth = spec.paths[endpoint][method]
  if (specmth?.requestBody) {
    const content = specmth.requestBody?.content || {}
    const contentTypes = Object.keys(content)
    if (contentTypes.length) {
      const schema = content[contentTypes[0]].schema
      if (!schema?.$ref) {
        fn(schema)
        return
      }
      $RefParser.dereference(spec, (err, spec2) => {
        const schema = spec2.paths[endpoint][method].requestBody.content['application/json'].schema;
        fn(schema)
      })  
    }
  }
}
module.exports = requestBody

/*
const jsfaker = require('json-schema-faker');
const schema = {
  "type": "object",
  "properties": {
    "username": {
      "type": "string"
    },
    "address": {
      "$ref": "#/components/schemas/Address"
    }
  },
  "required": ["username", "address"],
  "components": {
    "schemas": {
      "Address": {
        "type": "object",
        "properties": {
          "street": {
            "type": "string",
            "minLength": 1
          },
          "city": {
            "type": "string",
            "minLength": 1
          },
          "state": {
            "type": "string",
            "enum": ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
          },
          "zipcode": {
            "type": "string",
            "pattern": "^[0-9]{5}(?:-[0-9]{4})?$"
          },
          "lastname": {
            "type": "string",
            "minLength": 1,
            "maxLength": 50,
            "nullable": true
          }
        },
        "required": ["street", "city", "state", "zipcode"]
      }
    }
  }
};

const generatePermutations = async (n) => {
  let permutations = [];

  for (let i = 0; i < n; i++) {
    const permutation = await jsfaker.generate(schema);
    permutations.push(permutation);
  }

  return permutations;
};

generatePermutations(10)
  .then((permutations) => console.log(permutations))
  .catch((error) => console.log(error));

  */