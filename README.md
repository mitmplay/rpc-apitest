# RPC Apitest
#### Installation
```js
npm i -g rpc-apitest
rpc-apitest -o // open browser to http://localhost:3001
```
Open in https & avoid warning of self-sign certificate  
```js
export NODE_TLS_REJECT_UNAUTHORIZED=0
rpc-apitest -os // open browser to https://localhost:3002
```


#### RPC call
```js
await RPC.apidemo.add()       //# no broadcast 
await RPC.apidemo.api_yesno() //# triggering broadcast
```

All api call start with : `'api_'` will be triggering a broadcast call to clients, and on namespace of `api` will getting auto trigger broadcast  
```js
await RPC.apidemo.api_yesno()   
await RPC.apidemo.api_u_agent() 

const ua="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:111.0) Gecko/20100101 Firefox/111.0"
await RPC.apidemo.api_u_agent({body:{ua}})

// special namespace: api...
await RPC.api.peek()
await RPC.api.fetch(...)
```

#### Registering `broadcast event`: 
```js
const fn = x => x
RPC._broadcast_._any_.fn = fn
RPC.['apidemo.yesno'] = fn
```
#### Public API
* https://apis.guru/
* https://www.apicagent.com/ 

<br/>
<hr/>

*Enjoy this tool, `wh`!* 
