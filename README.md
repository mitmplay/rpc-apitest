# RPC Apitest
# Installation
```js
npm i -g rpc-apitest
```
# Open in http  
```js
// -d devmode
// -o open browser
rpc-apitest -do // open browser to http://localhost:4001

// debugging server code
NODE_OPTIONS='--inspect' rpc-apitest -do
NODE_OPTIONS='--inspect-brk' rpc-apitest -do
```

# Open in https & avoid warning: self-sign certificate  
```js
// -s open in https
export NODE_TLS_REJECT_UNAUTHORIZED=0
rpc-apitest -dos // open browser to https://localhost:4002
```


# RPC call
Open Chrome Devtools Console, test it by copy paste one line and execute

or you can try from UI `Tab:Script` 
```js
await RPC.apidemo.demo_add()  //# no broadcast 
await RPC.apidemo.api_yesno() //# triggering broadcast
```

All api start with: `'.api_'` will trigger broadcast message
```js
await RPC.apidemo.api_yesno()   
await RPC.apidemo.api_u_agent() 

var ua= 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:111.0) Gecko/20100101 Firefox/111.0'
await RPC.apidemo.api_u_agent({body:{ua}})

// special namespace: api...
await RPC.api.peek()
await RPC.api.fetch({
  url: "https://api.apicagent.com/",
  method: "post",
  headers: {
    "Content-Type": "application/json"
  },
  body: {ua}
})
```
# Request Tab
Each of requests are define using YAML file and can having variable and dynamic-var content where the parser of vars denotate with `{static-var}` & `{{dynamic-var}}` and to search the value it will use templates:

* `{static-var}` => `_template_.yaml`
* `{{dynamic-var}}` => `_template_.js`

Each `request definition file` will be loaded in the UI and can be tested, as the files is watched!, when you edit the file and save it, it will automaticaly reflected on the UI.

```js
await RPC.api.fetch('apidemo/u_agent_post') run
```
# Parser
## Simple
```js
greet: Hello       // _template_.yaml

...
body: {greet}      // request_post.yaml
=> body: Hello
```
## Nested
```js
greet:             // _template_.yaml
  nice: Hi Alice

body: {greet.nice} // request_post.yaml
=> body: Hi Alice

body: {greet}      // request_post.yaml
=> body:
     nice: Hi Alice
```
## Shorthand `{&}`
```js
greet:             // _template_.yaml
  body: Howdy John

body: {greet.&}    // request_post.yaml
   ~> {greet.body}
=> body: Howdy John
```
# Function Parser
Function parser is a special `\_template\_.js` to host functions and it can use inside request:
```js
module.exports = $ => ({ // _template_.js
  first: _ => rpc()._lib_.chance.first(),
  dtnow: _ => `{greet-ed} ${(new Date()).toISOString()}`,
})

body: {{now}}            // request_post.yaml
=> body: 2023-04-20T07:34:57.092Z
``` 
# Chance faker
Built in Function Parser to generate random faker, you can visit [Chance website](https://chancejs.com/)
```js
body: {{chance.address}} // request_post.yaml
=> body: 908 Cezkaw Junction
``` 
Use Chrome Console browser to test `chance faker`
```js
await RPC.api.chance('name')
await RPC.api.chance('address')
await RPC.api.chance('cc', {type: 'mc'})
await RPC.api.chance('cc', {type: 'visa'})
await RPC.api.chance('paragraph', { sentences: 1 })
```
# OpenApi & mock server

When you have an OpenAPI difinition file in YAML, you can drop it to your home folder: `~/user-rpc/apidemo` 
```js
npm install -g @stoplight/prism-cli
prism mock https://raw.githack.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml

// test the OpenApi mock server with fetch function
await RPC.api.fetch({
  url: "http://127.0.0.1:4010/pets",
  method: "get",
  headers: {
    "Content-Type": "application/json",
    api_key: "123"
  }
})

// use mock definition visible on the UI Tab:OpenApi
await RPC.api.fetch('apidemo/openapi[get]/pet')
```
# Registering `broadcast event`: 
```js
const fn = x => console.log(x)
RPC._broadcast_._any_.fn = fn
RPC._broadcast_['apidemo.api_yesno'] = fn
```

# Public API
Some sample of public APIs:
* https://apis.guru/
* https://www.apicagent.com/ 

<br/>
<hr/>

*`wh`!* 
