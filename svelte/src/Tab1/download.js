import {req, resp} from './Tab1';
const css = `
<html>
<header>
<style>
b {color: red;}
i {font-size: small;font-weight: bold;}
table {border-collapse: collapse;width: 100%;}
td {border: solid 3px brown;vertical-align: baseline;}
td.rw1 {width: 30px;text-align: end;}
td.rw2 {width: 75px;text-align: center;}
td.rw3 {width: 60px;text-align: center;}
td.data {width: calc(100% - 165px);}
tr:hover {background-color: yellow;}
pre {margin: 0;padding: 0 0 5px 17px;}
summary {color: blueviolet;font-weight: bold;}
.reqs,.rspB,.resp_2 {background-color: aliceblue;}
.resp_4,.resp_5 {background-color: bisque;}
.resp_3 {background-color: palegoldenrod;}
.rspH {background-color: antiquewhite;}
</style>
</header>
<body>
<table>`

export function download_html(e, json) {
  const arr = []
  for (const _id in json.logs) {
    const {
      id,
      host,
      chkLog,
      rspcode,
      request,
      resp_hdr,
      response,
    } = json.logs[_id]
    if (chkLog) {
      const {method,url} = JSON.parse(request)
      const content = `<tr class="resp_${Math.floor(rspcode/100)}">
<td class="rw1">${id}</td>
<td class="rw2">${host}</td>
<td class="rw3">${method}<i>(${rspcode})</i></td>
<td class="data"><details>
<summary>${url}</summary>
<pre class="reqs"><b>Request: </b>${request}</pre>
<pre class="rspH">Response Hdr: ${resp_hdr}</pre>
<pre class="rspB">Response Body: ${response}</pre>
</details></td>
</tr>`
      arr.unshift(content)
    }
  }
  arr.unshift(css)
  arr.push('</table></body>\n</html>')
  var htmlToSave = arr.join('\n');
  var hiddenElement = document.createElement('a');

  hiddenElement.href = 'data:attachment/text,' + encodeURI(htmlToSave);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'apitest.html';
  hiddenElement.click();
}
