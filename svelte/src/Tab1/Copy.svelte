<script>
  export let logs;

  let ttip = ''

  async function copyClipboard(e) {
    const id = e.target.parentElement.parentElement.dataset.id
    let {request, resp_hdr, response} = logs[id]
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
    } else {
      request  = `"1.Request":\n${      request }`
      resp_hdr = `"2.Response Hdr":\n${ resp_hdr}`
      response = `"3.Response Body":\n${response}`
      if (copy==='all') {
        str = [request, resp_hdr, response].join(',\n')
      } else if (copy==='reqs') {
        str = request
      } else if (copy==='resp') {
        str = [resp_hdr, response].join('\n')
      }
      str = `{${str}}`
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
  [<a href=# data-copy=curl on:click={copyClipboard}>curl</a>]
  {#if ttip!==''}
    <span class=notify>{ttip}</span>
  {/if}
</div>

<style lang="scss">
.copylink {
  color: cadetblue;
  font-size: 12px;
}
.notify {
  color: red;
  border: solid;
  padding: 0 2px;
  margin: 2px 0 0 2px;
  position: fixed;
  z-index: 1000;
}
</style>