<script>
  export let json;

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
    const {copy} = e.target.dataset
    let str = ''
    if (copy==='curl') {
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