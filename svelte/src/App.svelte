<script>
  import { onMount, afterUpdate} from 'svelte';
  import {no1, date, meth, resp, trunc} from './App';

  let rows = []

  onMount(() => {
    window.RPC._broadcast_._any_.homepage = async data => {
      const {broadcast, result} = data
      console.log({broadcast})
      rows = result
    }
    setTimeout(async ()=>{await window.RPC.api.peek()}, 500)
  })
</script>

<svelte:head>
  <title>RPC Apitest</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<h1>(R)emote (P)rocedure (C)all Apitest</h1>
<section>
  {#each rows as row}
    <details>
      <summary>{no1(row)}.[{date(row)}][{meth(row)}]{row.api}~>({row.rspcode})</summary>
      <div class="main-content">
        <details>
          <summary>Response headers</summary>
          <div class="resp-content">
            <pre>{row.x_tag}</pre>
            <pre>{resp(row)}</pre>  
          </div>
        </details>
        <div class="sub-content">
          <div class="title aliceblue"><b>Response Body: {'{'}</b></div>
          <pre class="aliceblue">{trunc(row.response)}</pre>
          <div class="title azure"><b>Request: {'{'}</b></div>
          <pre class="azure">{trunc(row.request)}</pre>  
        </div>
      </div>
  </details>
  {/each}
</section>

<style lang="scss">
  h1 {
    font-size: small;
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
  .azure {
    background-color: azure;
  }
  .aliceblue {
    background-color: aliceblue;
  }
</style>
