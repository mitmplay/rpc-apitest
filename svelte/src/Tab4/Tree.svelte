<script>
  export let _req
  export let json
  import {clickSummary} from '../stores/oapiStore';
  import Tree from './Tree.svelte';
  import Collapsible from '../components/Collapsible.svelte';

  function toArray(_json) {
    const arr1 = []
    const arr3 = []
    for (const key in _json) {
      if (_json[key].run) {
        arr3.push(key)
      } else if (!/^_/.test(key) ) {
        arr1.push(key)
      }
    }
    const arr = [
      ...arr1.sort(),
      ...arr3.sort(),
    ]
    return arr
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
  <Collapsible {nspace} name=_openName open={json[nspace]._openName}>
    <summary slot=head on:click={evn => clickSummary(evn, _req, json)}>
      {#if /_template_/.test(json[nspace].run)}
        <b>{`${json[nspace].run.split('/').pop()}`}</b>
      {:else if json[nspace].run}
        <i>await</i> RPC.api.fetch('<b>{`${json[nspace].run}`}')</b>
        <a href="#" class=_hover_ data-run={json[nspace].run} on:click={run}>run</a>
      {:else}
        {nspace}
      {/if}
    </summary>
    <div slot=body>
      {#if json[nspace].run}
        {#if RPC._obj_?.argv?.json}
          <pre class="aliceblue"><code class="language-json">{@html json[nspace].request || '...'}</code></pre>
        {:else}
          <pre class="aliceblue"><code class="language-yaml">{@html json[nspace].request || '...'}</code></pre>
        {/if}
      {:else}
        <div><Tree {_req} json={json[nspace]} /></div>
      {/if}
    </div>
  </Collapsible>
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
