# RPC Apitest

RPC Apitest - an Isomorphic Rest-client to test API from Web, Nodejs or Browser Console. One of key feature is authoring request with `YAML nested templating`.

`Env` can be set on root template, next YAML nested can have `opt-select`, either unique or multi-select, and before execution(`run`) of request, `opt-run` can be set to override what template provide.

The templating shared that values across same tree.

# Installation
```js
npm i -g rpc-apitest

rpc-apitest -h
```
## Open in http  
```js
// -d devmode
// -o open browser
rpc-apitest -do // open browser to http://localhost:4001

// debugging server code
NODE_OPTIONS='--inspect' rpc-apitest -do
NODE_OPTIONS='--inspect-brk' rpc-apitest -do
```

## Open in https & avoid warning: self-sign certificate  
```js
// -s open in https
export NODE_TLS_REJECT_UNAUTHORIZED=0
rpc-apitest -dos // open browser to https://localhost:4002
// or
NODE_TLS_REJECT_UNAUTHORIZED=0 rpc-apitest -dos
```

# Tabs - The Web UI
The Web UI consist of five tabs:
* Logs - Show the saved logs after APIs execution
* Request - The request definition, and run/execute 
* Script (rpc) - Script definition, and run/execute
* OpenApi - Open Api definition with sample request
* Docs - Documents in Markdown format

## Logs Tab
Main functionality is to show the logs after APIs execution, UI interactivity are wired using web-socket, all web-socket connection having Logs auto refresh after each execution(run). There are three type of list (in descending order ): 
* All - No grouping
* Api - group by api-host
* Host - group by usr host
* Date - group by date

Each logs are inside section of: **Request**, **Response Hdr** & **Response Body**, you can set to auto-expand by checking the checkbox on the action-bar. additional section: **Validate** will appear if request call included Validate definition. 

**Yaml checkbox** on the action-bar is to see the logs format in **YAML**

To download the logs, you can checked the row then click "Download" button.

Row also having option to show/hide  **host**, **date** & **elapsed** (how long API will response), the option are hidden as a popup on the right top screen under checkbox config "**Limit Header**". the "**Show Logs**" config is auto-change to first tab after API execution.  

## Request Tab
Each of requests are define using **YAML** file and can having **variable** and **dynamic-var**, this vars are mostly define in template, and the parser will identify vars by seeing words inside curly-braces `{static-var}` hosted in `\_template\_.yaml` & `{{dynamic-var}}` in `\_template\_` and to search the value it will use templates:

* `{static-var}` => `_template_.yaml`
* `{{dynamic-var}}` => `_template_.js`

Each `request definition file` will be loaded in the UI and can be tested, as the files is watched!, when you edit the file and save it, it will refresh the UI.

**Parser checkbox** on the action-bar will help (when checked) to see the end result result, but for random value using fake in dynamic vars, the values can be different during the execution of API call.

**Source checkbox** on the action-bar is to see the source code of request 

```js
await RPC.api.fetch('apidemo/u_agent_post') run
```
<details><summary><b>Parser</b></summary>

## Parser
Some Variable definition in request are reserved for specific purpose:

| var     | description                               |
|---------|-------------------------------------------|
| url     | full-path api-url                         |
| method  | request-method `[get\|post\|put\|delete]` |
| headers | request-headers                           |
| params  | query-params `[get]`, injected into `url` |
| body    | request-body `[post\|put]`                |

### Dynamic Variables
Capability of RPC-Apitest to interprate specific string rules (world inside curly-braces) as variable and during parsing, some rules having different meaning on how replacement behave: 

#### Simple
if the world inside curly-braces contains "strings" chars without dots.
```js
greet: Hello        // _template_.yaml

...
body: {greet}       // request_post.yaml

=> body: Hello      // result
```
#### Nested
meaning two-things 1) the definition is nested and want to access specific value, the world inside curly-braces need to reach the nested using "dots" separator -OR- 2) its a simple parser way with result of replacement will be nested.
```js
greet:              // _template_.yaml
  nice: Hi Alice

...
body: {greet.nice}  // request_post.yaml

=> body: Hi Alice

...
body: {greet}       // request_post.yaml

=> body:
     nice: Hi Alice // result
```
#### Shorthand `{&}`
Ampersand will denotate the current key, ie: below show how it works during the parser
```js 
greet:              // _template_.yaml
  body: Howdy John

...
body: {greet.&}     // request_post.yaml
~>    {greet.body}

=> body: Howdy John // result
```
#### Spread
Basic meaning is to replace the key with the nested values
```js
names:              // _template_.yaml
  first: John
  last: Doe

...
body:               // request_post.yaml
  _1: '{...names}'

=> body:            // result
    first: John
    last: Doe
```
### Inject on specific key
when **the Spread** words contain tilde "~" after it, its a key that need to search and do merged values.
```yaml
_validate: 
  -@:
    id: true
    userId: true
    title: true 
  response:
    200: 'records'

_body~-@:
  userId: false
  body: true

runs:
  validate~1: 
    _1: '{..._validate}'
  validate~2:
    _1: '{..._validate}'
    _2: '{..._body~-@}'

=>
runs:
  validate~1: 
    -@:
      id: true
      userId: true
      title: true 
    response:
      200: 'records'
  validate~2:
    -@:
      id: true
      userId: false
      title: true 
      body: true
    response:
      200: 'records'
```
</details>

<details><summary><b>Function Parser</b></summary>

## Function Parser
Function parser is a special `\_template\_.js` to host functions and it can use inside request as `{{dynamic-var}}`:
```js
module.exports = $ => ({ // _template_.js
  first: _ => rpc()._lib_.chance.first(),
  dtnow: _ => `{greet-ed} ${(new Date()).toISOString()}`,
})

body: {{now}}            // request_post.yaml
=> body: 2023-04-20T07:34:57.092Z
``` 
</details>

<details><summary><b>_template_.yaml</b></summary>

### Example of ROOT `_template_.yaml`
```yaml
baseurl: http://baseurl.com

env:
  dev:
    greet: '{baseurl}/hello from DEV'
  qa: 
    greet: '{baseurl}/hello from QA'
  noreplace: 'no change on vars'

default:
  method: get
  headers:
    Content-Type: application/json

greet: Hi from non ENV
greet-ed: hello

mainurl: '{baseurl}/woo'
date: '{{dtnow}}'
```
### Example after ROOT `_template_.yaml`

```yaml
select:
  w-me:
    me: 'its me'
  s~one:
    greet: howdy one
  s~two:
    greet: howdy two
```
**env:** on the root \_template\_ will determine which var will be taken presedence over regular one. the **Active Env** is visible on the UI as it show on the right-side of **the root \_template\_**. you can see var getting replaced by checking the `Parser` option on action-bar. Example below on `greet` var the posibility of values getting replaced:
```yaml
# env: dev
greet: 'http://baseurl.com/hello from DEV'

# env: qa
greet: 'http://baseurl.com/hello from QA'

# env: noreplace
greet: 'Hi from non ENV'

# select: one
greet: howdy one
``` 
**select:**/(**slc**) if selection is set, it will take precedence over (**env**) as show in last example when select set to **s~one** the greet value change to 'howdy one'. **text with tilde** is identified for unique selection.

**default:** on the root \_template\_ will be used on request definition
```yaml
# test.yaml
url: '{baseurl}/hello'
```
Parsed values:
```yaml
url: 'http://baseurl.com/hello'
headers:
  method: get
  Content-Type: application/json
```
</details>

<details><summary><b>Chance faker</b></summary>

## Chance faker
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
</details>

## Script / RPC call
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
## OpenApi & mock server

When you have OpenAPI difinition YAML, you can drop it to your home folder: `~/user-rpc/apidemo/openapi` 
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

# Folder Structure
```js
// default folder at home: ~/user-rpc/name_space/type/files, ie:
* ~/user-rpc/apidemo/docs/readme.md             // markdown file for documentation
* ~/user-rpc/apidemo/openapi/some_openapi.yaml  // YAML file OpenAPI definition
* ~/user-rpc/apidemo/request/some_api_req.yaml  // YAML file request definition
* ~/user-rpc/apidemo/script/script1.js          // Javascript file

// you can change the path using CLI option:
// -r=~/proj/apidemo     OR 
// --rpcpath=~/proj/apidemo
* ~/proj/apidemo/docs/readme.md             // markdown file for documentation
* ~/proj/apidemo/openapi/some_openapi.yaml  // YAML file OpenAPI definition
* ~/proj/apidemo/request/some_api_req.yaml  // YAML file request definition
* ~/proj/apidemo/script/script1.js          // Javascript file
```

# Registering `broadcast event`: 
```js
const fn = x => console.log(x)
RPC._broadcast_._any_.fn = fn
RPC._broadcast_['apidemo.api_yesno'] = fn
```

# Unable to verify the first certificate
`Error: unable to verify the first certificate` means that the web server is misconfigured and didn't send the intermediate certificates. if you have the certificate, you can set the NODE_EXTRA_CA_CERTS environment variable

```js
export NODE_EXTRA_CA_CERTS='some_extra_certs.pem'
```
or if follow with `UNABLE_TO_VERIFY_LEAF_SIGNATURE` try to set environment variable
```js
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

# Public API
Some sample of public APIs:
* https://apis.guru/
* https://xkcd.com/json.html

<br/>
<hr/>

*`wh`!* 
