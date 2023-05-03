<script>
  export let _req
  export let json
  import {reqs, clickSummary}  from '../stores/reqsStore';
  import {logs, clickCollapse} from '../stores/logsStore';
  import Tree from './Tree.svelte';

  function toArray(_json) {
    const arr1 = []
    const arr2 = []
    const arr3 = []
    for (const key in _json) {
      if (/_template_/.test(key)) {
        arr1.push(key)
      } else if (_json[key].run) {
        arr3.push(key)
      } else if (!/^_/.test(key) ) {
        arr2.push(key)
      }
    }
    const arr = [
      ...arr1.sort(),
      ...arr2.sort(),
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
      if ($reqs.options.autoShowlog) {
        clickCollapse({activeTab:1, rowid: msg.rowid})
      }
    } else {
      console.log(msg)
    }
    RPC._obj_.run = msg   
  }

  function showRequest(nspace) {
    const {request, ori} = json[nspace]
    if ($reqs.options.autoParsed) {
      return request
    } else {
      return ori
    }
  }
</script>

{#each toArray(json) as nspace}
<details data-nspace={nspace} data-name="_openName" open={json[nspace]._openName}>
  <summary on:click={evn => clickSummary(evn, _req, json)}>
    {#if /_template_/.test(json[nspace].run)}
      <b>{`${json[nspace].run.split('/').pop()}`}</b>
    {:else if json[nspace].run}
      <i>await</i> RPC.api.fetch('<b>{`${json[nspace].run}`}')</b>
      <a href="#" data-run={json[nspace].run} on:click={run}>run</a>
    {:else}
      {nspace}
    {/if}
  </summary>
  {#if json[nspace].run}
    {#if RPC._obj_?.argv?.json}
      <pre class="aliceblue"><code class="language-json">{@html showRequest(nspace) || '...'}</code></pre>
    {:else}
      <pre class="aliceblue"><code class="language-yaml">{@html showRequest(nspace) || '...'}</code></pre>
    {/if}
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
