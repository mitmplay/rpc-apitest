<script>
  export let logs;
  export let _id;

  let ttip = ''
  /*
  wget --no-check-certificate --quiet \
  --method GET \
  --timeout=0 \
  --header '' \
   'https://xkcd.com/info.0.json'


 wget --no-check-certificate --quiet \
  --method POST \
  --timeout=0 \
  --header 'lol: lel' \
  --header 'Content-Type: text/plain' \
  --body-data '{"woow": "kereen"}' \
   'https://xkcd.com/info.0.json'  
  */

  async function copyClipboard(e) {
    let {request, resp_hdr, response} = logs[_id]
    const {copy} = e.target.dataset
    let str = ''
    if (copy==='curl') {
      const json = JSON.parse(request)
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
    } else if (copy==='wget') {
      const json = JSON.parse(request)
      str = `wget --no-check-certificate --quiet \\
  --method ${json.method.toUpperCase()} \\
  --timeout=0 \\
`
      for (const key in json.headers) {
        str += `  --header '${key} ${json.headers[key]}' \\\n`
      }
      if (['put', 'post'].includes(json.method)) {
        str += `  --body-data '${JSON.stringify(json.body)}' \\\n`
      }
      str += `  '${json.url}'`
    } else {
      request  = `1.Request:\n${      request }`
      resp_hdr = `2.Response_Hdr:\n${ resp_hdr}`
      response = `3.Response_Body:\n${response}`
      if (copy==='all') {
        str = [request, resp_hdr, response].join('\n')
      } else if (copy==='reqs') {
        str = request
      } else if (copy==='resp') {
        str = [resp_hdr, response].join('\n')
      }
      str = `${str}`
    }

    await navigator.clipboard.writeText(str);
    ttip = 'ok, copy to clipboard!'
    setTimeout(()=>{
      ttip = ''
    }, 1000)
  }
</script>

<div class="copylink">
  json: 
  [<a href=# data-copy=all  on:click={copyClipboard}>all </a>] 
  [<a href=# data-copy=resp on:click={copyClipboard}>resp</a>]
  [<a href=# data-copy=reqs on:click={copyClipboard}>reqs</a>] | cmd:
  <span class="copies">
    <div>
      [<a href=# data-copy=curl on:click={copyClipboard}>curl </a>]
    </div>
    <ul>
      <li>[<a href=# data-copy=wget on:click={copyClipboard}>wget</a>]</li>
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
  margin: 0 0 0 49px;
  position: fixed;
  z-index: 1000;
}
span.copies {
  border: 1px solid white;
  position: absolute;
  text-align: center;
  display: inline-table;
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
  &,ul {
    width: 44px;
  }
}
</style>