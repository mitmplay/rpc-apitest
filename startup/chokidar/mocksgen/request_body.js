const $RefParser = require('json-schema-ref-parser');
const jsf = require('json-schema-faker');

function requestBody(spec, endpoint, method, fn) {
  const content = spec.paths[endpoint][method]?.requestBody?.content || {}
  const schemaRef = content['application/json']?.schema?.$ref

  if (!schemaRef) {
    console.error('Support only json/schema-ref')
    return
  }

  $RefParser.dereference(spec, (err, spec2) => {
    const schema = spec2.paths[endpoint][method].requestBody.content['application/json'].schema;
    fn(schema)
  })  
}
module.exports = requestBody

/*
const jsf = require('json-schema-faker');
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
    const permutation = await jsf.generate(schema);
    permutations.push(permutation);
  }

  return permutations;
};

generatePermutations(10)
  .then((permutations) => console.log(permutations))
  .catch((error) => console.log(error));

  */