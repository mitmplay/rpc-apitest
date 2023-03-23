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
await RPC.apidemo.yesno() //# withour triggering broadcast
```
#### RPC call w. `broadcast event`
Add last param with: `'*'` to trigger broadcast call to clients
```js
await RPC.apidemo.yesno(..., '*') //# triggering broadcast

//# i.e.:
await RPC.apidemo.yesno('*')
await RPC.apidemo.u_agent('*')
const ua="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:111.0) Gecko/20100101 Firefox/111.0"
await RPC.apidemo.u_agent({body:{ua}},'*')
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
