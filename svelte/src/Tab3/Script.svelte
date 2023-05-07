<script lang="ts">
  import {onMount} from 'svelte';
  import {
    rpc, 
    init, 
    filter,
    clickSummary, 
    showCode
  } from '../stores/apiStore';
  import {
    logs,
    clickCollapse
  } from '../stores/logsStore';
  import Actions  from './Actions.svelte';

  onMount(_ => init($rpc))

  function toArray(json) {
    let arr = Object.keys(json)
    arr = arr.filter(filter).sort()
    return arr
  }

  async function run(evn) {
    const {RPC} = window
    const {nspace,fn} = evn.target.dataset
    console.log(`await RPC.${nspace}.${fn}()`)
    const msg = await RPC[nspace][fn]()
    if (typeof msg==='object' && msg!==null) {
      console.log(JSON.stringify(msg, null, 2))
      if ($logs.options.autoShowlog) { //# autoShowlog
        clickCollapse({activeTab:1, rowid: msg.rowid})
      }
    } else {
      console.log(msg)
    }
    RPC._obj_.run = msg    
  }
</script>

<svelte:head>
  <title>Show content</title>
  <meta name="description" content="Showing some contents" />
</svelte:head>

<Actions />
<section>
  {#each toArray(window.RPC) as nspace}
  <details data-nspace={nspace} data-name="_openName" open={$rpc.rpc[nspace] && $rpc.rpc[nspace]._openName}>
    <summary on:click={clickSummary}>
      {nspace}
    </summary>
    <div>
      {#each toArray(window.RPC[nspace]) as fn}
        <details data-nspace={nspace} data-fn={fn} data-name="_openCode" open={$rpc.rpc[nspace] && $rpc.rpc[nspace][fn]._openCode}>
          <summary on:click={e=>showCode(e,$rpc.rpc)}>
            {#if /_template_/.test(fn)}
              <b>{`${fn}`}</b>
            {:else}
              <i>await</i> {`${nspace}`}.<b>{`${fn}`}</b>()
              <a href="#" data-nspace={nspace} data-fn={fn} on:click={run}>run</a>
            {/if}
          </summary>  
          <pre><code class="language-js">{@html $rpc.rpc[nspace] && $rpc.rpc[nspace][fn]?.code}</code></pre>
        </details>
      {/each}
    </div>
  </details>
  {/each}  
</section>

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
  pre {
    background: linen;
  }
</style>
