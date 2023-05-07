// Credits: 
// https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
// https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html

const cookie = str => {
  str = str.slice(1,-1).split(/; +/).sort().join('\n')
  return `
<p class='ttp'>The Cookie HTTP request header contains stored HTTP cookies associated with the server (i.e. previously sent by the server with the Set-Cookie header or set in JavaScript using Document.cookie).</p>
<p class='ttp'>The Cookie header is optional and may be omitted if, for example, the browser's privacy settings block cookies.</p>
<p class='ttp values'>${str}</p>`
}

const csp = str => {
  str = str.slice(1,-1).replace(/; +/g, '\n') 
  return `
<p class='ttp'>The HTTP Content-Security-Policy response header allows website administrators to control resources the user agent is allowed to load for a given page. With a few exceptions, policies mostly involve specifying server origins and script endpoints. This helps guard against cross-site scripting attacks (Cross-site_scripting).</p>
<p class='ttp values'>${str}</p>`
}

const alltyp = {}
const parser = {}

parser['Cookie:'                               ] = cookie
parser['content-security-policy:'              ] = csp
parser['x-webkit-csp-report-only:'             ] = csp
parser['content-security-policy-report-only:'  ] = csp
parser['x-content-security-policy-report-only:'] = csp
parser['method:'                               ] = _ => `<p class=ttp>HTTP defines a set of <b>request methods</b> to indicate the desired action to be performed for a given resource. Although they can also be nouns, these request methods are sometimes referred to as HTTP verbs. Each of them implements a different semantic, but some common features are shared by a group of them: e.g. a request method can be safe, idempotent, or cacheable.</p><ul class=ttp>
<li>GET     - Requests using GET should only retrieve data.</li>
<li>HEAD    - A GET request, but without the response body.</li>
<li>PUT     - Replaces target resource with the request payload.</li>
<li>POST    - Submits to resource, often causing state changes on the server.</li>
<li>DELETE  - Deletes the specified resource.</li>
<li>CONNECT - Establishes a tunnel to the server identified by the target resource.</li>
<li>OPTIONS - Describes the communication options for the target resource.</li>
<li>TRACE   - Performs a message loop-back test along the path to the target resource.</li>
<li>PATCH   - Applies partial modifications to a resource.</li>
</ul>
`
parser['Content-Type:'                         ] = _ => `<p class=ttp>The <b>Content-Type</b> representation header is used to indicate the original media type of the resource (prior to any content encoding applied for sending).</p>`
parser['x-content-type-options:'               ] = _ => '<p class=ttp>The <b>X-Content-Type-Options</b> response HTTP header is a marker used by the server to indicate that the MIME types advertised in the Content-Type headers should be followed and not be changed. The header allows you to avoid MIME type sniffing by saying that the MIME types are deliberately configured.</p>'
parser['x-xss-protection:'                     ] = _ => `<p class=ttp style="background:orangered;">
Non-standard: This feature is non-standard and is not on a standards track. Do not use it on production sites facing the Web: it will not work for every user. There may also be large incompatibilities between implementations and the behavior may change in the future.</p><p class=ttp>
The HTTP X-XSS-Protection response header is a feature of Internet Explorer, Chrome and Safari that stops pages from loading when they detect reflected cross-site scripting (XSS) attacks. These protections are largely unnecessary in modern browsers when sites implement a strong Content-Security-Policy that disables the use of inline JavaScript ('unsafe-inline').</p>`

// resp-headers
const date          = _ => `<p class=ttp>The <b>Date</b> general HTTP header contains the date and time at which the message originated.</p>`
const etag          = _ => `<p class=ttp>The <b>ETag</b> (or entity tag) HTTP response header is an identifier for a specific version of a resource. It lets caches be more efficient and save bandwidth, as a web server does not need to resend a full response if the content was not changed. Additionally, etags help to prevent simultaneous updates of a resource from overwriting each other ("mid-air collisions").</p>`
const sttus         = _ => `<p class=ttp>HTTP response <b>status</b> codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped in five classes:</p>
<ul class=ttp>
<li>Informational responses (100 – 199)</li>
<li>Successful responses (200 – 299)</li>
<li>Redirection messages (300 – 399)</li>
<li>Client error responses (400 – 499)</li>
<li>Server error responses (500 – 599)</li>
</ul>
`
const server        = _ => `<p class=ttp>The <b>Server</b> header describes the software used by the origin server that handled the request — that is, the server that generated the response.</p>`
const xruntime      = _ => `<p class=ttp>The <b>X-Runtime</b> HTTP response header is used to provide the time (in seconds) an application takes to process each request.</p>`
const xrequest      = _ => `<p class=ttp>Correlates HTTP requests between a client and server.</p>`
const xpowered      = _ => `<p class=ttp>The <b>X-Powered-By</b> header describes the technologies used by the webserver.</p>`
const xframeOption  = _ => '<p class=ttp>The <b>X-Frame-Options</b> HTTP response header can be used to indicate whether or not a browser should be allowed to render a page in a &lt;frame&gt;, &lt;iframe&gt;, &lt;embed&gt; or &lt;object&gt;. Sites can use this to avoid click-jacking attacks, by ensuring that their content is not embedded into other sites.'
const xcontentType  = _ => `<p class=ttp>The <b>X-Content-Type-Options</b> response HTTP header is used by the server to indicate to the browsers that the MIME types advertised in the Content-Type headers should be followed and not guessed.</p>`
const connection    = _ => `<p class=ttp>The <b>Connection</b> general header controls whether the network connection stays open after the current transaction finishes. If the value sent is keep-alive, the connection is persistent and not closed, allowing for subsequent requests to the same server to be done.</p>`
const contentType   = _ => `<p class=ttp>In responses, a Content-Type header provides the client with the actual content type of the returned content. This header's value may be ignored, for example when browsers perform MIME sniffing; set the X-Content-Type-Options header value to nosniff to prevent this behavior.</p>`
const contentLength = _ => `<p class=ttp>The <b>Content-Length</b> header indicates the size of the message body, in bytes, sent to the recipient.</p>`
const transEncoding = _ => `<p class=ttp>The <b>Transfer-Encoding</b> header specifies the form of encoding used to safely transfer the payload body to the user.</p>`
const cacheControl  = _ => `<p class=ttp>The <b>Cache-Control</b> HTTP header field holds directives (instructions) — in both requests and responses — that control caching in browsers and shared caches (e.g. Proxies, CDNs).</p>`
const acAllowMth    = _ => `<p class=ttp>The <b>Access-Control-Allow-Methods</b> response header specifies one or more methods allowed when accessing a resource in response to a preflight request.</p>`
const acRequestMth  = _ => `<p class=ttp>The <b>Access-Control-Request-Method</b> request header is used by browsers when issuing a preflight request, to let the server know which HTTP method will be used when the actual request is made. This header is necessary as the preflight request is always an OPTIONS and doesn't use the same method as the actual request.</p>`
const acExposeHdrs  = _ => `<p class=ttp>The <b>Access-Control-Expose-Headers</b> response header allows a server to indicate which response headers should be made available to scripts running in the browser, in response to a cross-origin request.</p>`
const acAllowCreds  = _ => `<p class=ttp>The <b>Access-Control-Allow-Credentials</b> response header tells browsers whether to expose the response to the frontend JavaScript code when the request's credentials mode (Request.credentials) is include.</p>`
const acAllowOrigin = _ => `<p class=ttp>The <b>Access-Control-Allow-Origin</b> response header indicates whether the response can be shared with requesting code from the given origin.</p>`
const reportTo      = _ => `<p class=ttp>The Content-Security-Policy <b>Report-To</b> HTTP response header field instructs the user agent to store reporting endpoints for an origin.</p>`
const altsvc        = _ => `<p class=ttp>(meaning Alternative Services) to indicate that its resources can also be accessed at a different network location</p>`

const respHdr = {}

respHdr['date:'                            ] = date
respHdr['etag:'                            ] = etag
respHdr['status:'                          ] = sttus
respHdr['server:'                          ] = server
respHdr['x-runtime:'                       ] = xruntime
respHdr['x-request-id:'                    ] = xrequest
respHdr['x-powered-by:'                    ] = xpowered
respHdr['x-frame-options:'                 ] = xframeOption
respHdr['x-content-type-options'           ] = xcontentType
respHdr['connection:'                      ] = connection
respHdr['content-type:'                    ] = contentType
respHdr['content-length:'                  ] = contentLength
respHdr['transfer-encoding:'               ] = transEncoding
respHdr['cache-control:'                   ] = cacheControl
respHdr['access-control-allow-methods:'    ] = acAllowMth
respHdr['access-control-request-method:'   ] = acRequestMth
respHdr['access-control-expose-headers:'   ] = acExposeHdrs
respHdr['access-control-allow-credentials:'] = acAllowCreds
respHdr['access-control-allow-origin:'     ] = acAllowOrigin
respHdr['report-to:'                       ] = reportTo
respHdr['alt-svc:'                         ] = altsvc

alltyp['resp-header'] = respHdr

export function ttparser(el) {
  const {target:t} = el
  let key = t.innerText
  if (key.length<100) {
    if (t.parentElement.classList.contains('language-json')) {
      key = `${key.replace(/"/g,'')}:`
    }
    const typ = el.currentTarget?.dataset?.typ
    const fn = alltyp[typ] && alltyp[typ][key] || parser[key]
    if (fn) {
      const str = t.nextSibling.nextElementSibling.innerText
      return fn(str)
    }  
  }
  return ''
}
