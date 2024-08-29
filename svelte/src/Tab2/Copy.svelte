<script>
  export let _ns;
  export let _run;
  export let json;
  import {option} from './lib/run';
  import {reqs}   from '../stores/reqsStore';
  let ttip = ''

  async function copyClipboard(e) {
    const {copy} = e.target.dataset
    let str = ''
    if (['curl', 'curl_pp'].includes(copy)) {
      if (json.method==='get') {
        str += `curl '${json.url}' \\\n`
      } else {
        str += `curl -X ${json.method.toUpperCase()} '${json.url}' \\\n`
      }
      for (const key in json.headers) {
        str += `  -H '${key}: ${json.headers[key]}' \\\n`
      }
      if (['put', 'post'].includes(json.method)) {
        str += `  -d '${JSON.stringify(json.body)}' \\\n`
      }
      str += `  --compressed`
      if (json.api.insecure) {
        str+= ` -k`
      }
      if (copy==='curl_pp') {
        str += ` | json_pp`
      }
    } else if (['wget', 'wget_pp'].includes(copy)) {
      str = `wget --no-check-certificate \\
  --method ${json.method.toUpperCase()} \\
  --timeout=0 \\
`
      for (const key in json.headers) {
        str += `  --header '${key}: ${json.headers[key]}' \\\n`
      }
      if (['put', 'post'].includes(json.method)) {
        str += `  --body-data '${JSON.stringify(json.body)}' \\\n`
      }
      str += `-qO- '${json.url}'`
      if (json.api.insecure) {
        str += ` --no-check-certificate`
      }
      if (copy==='wget_pp') {
        str += ` | json_pp`
      }
    } else if (['devtool'].includes(copy)) {
      let {run} = e.currentTarget.dataset
      const {opt, is_opt} = await option(run, _ns, $reqs.req)
      const _str = is_opt ? `, ${JSON.stringify(opt)}` : ''
      str = `var msg = await RPC.api.fetch('${run}'${_str});
console.log('Result:', msg);
const {statusCode, body} = msg?.response;
console.log(JSON.stringify({statusCode, body}, null, 2));
`
      console.log(str)
    }
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(str);
    } else {
      unsecuredCopy(str);
    }
    ttip = 'ok, copy to clipboard!'
    setTimeout(()=>{
      ttip = ''
    }, 1000)
  }
  function unsecuredCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('failed copy to clipboard!', err);
    }
    document.body.removeChild(textArea);
  }
</script>

<div class="copylink">
  cmd:
  <span class="copies">
    <div>
      [<a href=# data-copy=curl on:click={copyClipboard}>curl </a>]
    </div>
    <ul>
      <li>[<a href=# data-copy=curl_pp on:click={copyClipboard}>curl pp</a>]</li>
      <li>[<a href=# data-copy=wget    on:click={copyClipboard}>wget</a>]</li>
      <li>[<a href=# data-copy=wget_pp on:click={copyClipboard}>wget pp</a>]</li>
      <li>[<a href=# 
        data-run={_run}
        data-copy=devtool 
        on:click={copyClipboard}>devtools</a>]</li>
    </ul>  
  </span>
  {#if ttip!==''}
    <span class=notify>{ttip}</span>
  {/if}
</div>

<style lang="scss">
.copylink {
  position: relative;
  color: cadetblue;
  font-size: 12px;
}
.notify {
  color: red;
  border: solid;
  padding: 0 2px;
  margin: -1px 0 0 60px;
  position: fixed;
  z-index: 1000;
}
span.copies {
  top: -2px;
  border: 1px solid white;
  position: absolute;
  display: inline-table;
  white-space: nowrap;
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: none;
  }
  &:hover {
    border: solid gray;
    background-color: azure;
    ul {
      display: block;
    }
  }
  div:hover, li:hover {
    background-color: antiquewhite;
  }
}
</style>