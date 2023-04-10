<script>
  export let _req
  export let json
  import {clickSummary} from '../stores/reqsStore';
  import Tree from './Tree.svelte';

  function toArray(_json) {
    const arr = Object.keys(_json)
    return arr.filter(id=>!/^_/.test(id)).sort()
  }

  async function run(evn) {
    const {run} = evn.target.dataset
    console.log(`await RPC.api.fetch('${run}')`)
    const msg = await RPC.api.fetch(run)
    if (typeof msg==='object' && msg!==null) {
      console.log(JSON.stringify(msg, null, 2))
    } else {
      console.log(msg)
    }
    RPC._obj_.run = msg   
  }
</script>

{#each toArray(json) as nspace}
<details data-nspace={nspace} data-name="_openName" open={json[nspace]._openName}>
  <summary on:click={evn => clickSummary(evn, _req, json)}>
    {#if json[nspace].run}
      <i>await</i> RPC.api.fetch('<b>{`${json[nspace].run}`}')</b>
      <a href="#" data-run={json[nspace].run} on:click={run}>run</a>
    {:else}
      {nspace}
    {/if}
  </summary>
  {#if json[nspace].run}
    <pre>{json[nspace].request || '...'}</pre>
  {:else}
    <div><Tree {_req} json={json[nspace]} /></div>
  {/if}
</details>
{/each}

<style lang="scss">
  summary{
    white-space: inherit;
  }
  i {
    color:crimson;
  }
  b {
    color:darkblue
  }
</style>

<!-- 
{#each $req.req[nspace] as name}
<details data-nspace={nspace} data-name={name}>
  <summary on:click={e=>showRequest(e,$req.req)}>
    <i>await</i>  RPC.api.fetch('<b>{`${name}`}')</b>
    <a href="#" data-nspace={nspace} data-name={name} on:click={run}>run</a>
  </summary>  
  <pre>...</pre>
</details>
{/each}
-->
