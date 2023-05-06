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

const parser = {}

parser['Cookie:'] = cookie
parser['x-content-security-policy-report-only:'] = csp
parser['content-security-policy-report-only:'] = csp
parser['x-webkit-csp-report-only:'] = csp
parser['content-security-policy:'] = csp
parser['x-content-type-options:'] = _ => '<p class=ttp>The X-Content-Type-Options response HTTP header is a marker used by the server to indicate that the MIME types advertised in the Content-Type headers should be followed and not be changed. The header allows you to avoid MIME type sniffing by saying that the MIME types are deliberately configured.</p>'
parser['Content-Type:'] = _ => `<p class=ttp>The Content-Type representation header is used to indicate the original media type of the resource (prior to any content encoding applied for sending).</p>`
parser['content-type:'] = _ => `<p class=ttp>In responses, a Content-Type header provides the client with the actual content type of the returned content. This header's value may be ignored, for example when browsers perform MIME sniffing; set the X-Content-Type-Options header value to nosniff to prevent this behavior.</p>`
parser['x-frame-options:'] = _ => '<p class=ttp>The X-Frame-Options HTTP response header can be used to indicate whether or not a browser should be allowed to render a page in a &lt;frame&gt;, &lt;iframe&gt;, &lt;embed&gt; or &lt;object&gt;. Sites can use this to avoid click-jacking attacks, by ensuring that their content is not embedded into other sites.'
parser['x-xss-protection:'] = _ => `<p class=ttp style="background:orangered;">
Non-standard: This feature is non-standard and is not on a standards track. Do not use it on production sites facing the Web: it will not work for every user. There may also be large incompatibilities between implementations and the behavior may change in the future.</p><p class=ttp>
The HTTP X-XSS-Protection response header is a feature of Internet Explorer, Chrome and Safari that stops pages from loading when they detect reflected cross-site scripting (XSS) attacks. These protections are largely unnecessary in modern browsers when sites implement a strong Content-Security-Policy that disables the use of inline JavaScript ('unsafe-inline').</p>`

export function ttparser(el) {
  const {target:t} = el
  const fn = parser[t.innerText]
  if (fn) {
    const str = t.nextSibling.nextElementSibling.innerText
    return fn(str)
  } else {
    return ''
  }
}
