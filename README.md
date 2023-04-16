# RPC Apitest
#### Installation
```js
// -d devmode
// -o open browser
npm i -g rpc-apitest
rpc-apitest -do // open browser to http://localhost:3001
```
Open in https & avoid warning of self-sign certificate  
```js
// -s open in https
export NODE_TLS_REJECT_UNAUTHORIZED=0
rpc-apitest -dos // open browser to https://localhost:3002
```


#### RPC call
```js
await RPC.apidemo.add()       //# no broadcast 
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

#### Test with mock server
```js
npm install -g @stoplight/prism-cli
prism mock https://raw.githack.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml

await RPC.api.fetch({
  url: "http://127.0.0.1:4010/pets",
  method: "get",
  headers: {
    "Content-Type": "application/json",
    api_key: "123"
  }
})
// use openapi mock request
await RPC.api.fetch('apidemo/openapi[get]/pet')
```
#### Registering `broadcast event`: 
```js
const fn = x => x
RPC._broadcast_._any_.fn = fn
RPC.['apidemo.api_yesno'] = fn
```

#### Public API
* https://apis.guru/
* https://www.apicagent.com/ 

<br/>
<hr/>

*`wh`!* 
