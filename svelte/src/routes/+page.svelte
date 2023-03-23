<script>
  // import Counter from './Counter.svelte';
  // import welcome from '$lib/images/svelte-welcome.webp';
  // import welcome_fallback from '$lib/images/svelte-welcome.png';
  import { onMount, afterUpdate} from 'svelte';

  let rows = []

  onMount(() => {
    const {_broadcast_, api_log} = window.RPC
    _broadcast_._any_.homepage = async data => {
      const {broadcast, result} = data
      console.log({broadcast})
      rows = result
    }
    setTimeout(async ()=>{await api_log.peek('*')},500)
  })

  function no1({id}, ln=3) {
    id = ''+ id 
    return id.padStart(ln, ' ')
  }

  function date({created,elapsed}, ln=3) {
    const dt = (new Date(created)).toISOString().replace(/\..+/,'')
    const str = ''+ Number(elapsed/1000).toFixed(2).padStart(ln, ' ')
    return `${dt.replace(/.{5}/,'').replace('T','|')}|${str}`
  }

  function resp({resp_hdr}) {
    if (resp_hdr) {
      const json = JSON.parse(resp_hdr)
      const arr = ['report-to', 'nel']
      arr.forEach(el => {
        const data = json[el]
        if (data) {
          json[el] = JSON.parse(data)
        }
      });
      return JSON.stringify(json, null, 2)        
    }
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  API(s):
  {#each rows as row}
    <details>
      <summary>{no1(row)}.[{date(row)}]{row.api}~>({row.rspcode})</summary>
      <div class="main-content">
        <details>
          <summary>Response headers</summary>
          <div class="resp-content">
            <pre>{row.x_tag}</pre>
            <pre>{resp(row)}</pre>  
          </div>
        </details>
        <div class="sub-content">
          <div class="title"><b>Response Body:</b></div>
          <pre>{row.response}</pre>
          <div class="title"><b>Request:</b></div>
          <pre>{row.request}</pre>  
        </div>
      </div>
  </details>
  {/each}
</section>

<style>
  summary{
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    font-family: monospace;
    white-space: pre;
  }
  summary:hover {
    background-color: yellow;
  }
  pre {
    font-size: 11px;
    margin-top: 0;
    margin-bottom: 6px;
  }
  .title>b {
    color: blue;
    font-size: 12px;
    font-weight: bold;
    font-family: monospace;
  }
  .main-content {
    padding-left: 15px;
  }
  .sub-content {
    padding-left: 10px;
  }
  .resp-content {
    margin-left: 10px;
    background-color: antiquewhite;
  }
  .resp-content pre {
    margin: 0;
  }
</style>
