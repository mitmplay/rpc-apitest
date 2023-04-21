<script lang="ts">
  import {onMount} from 'svelte';
  import {rpc, clickSummary, showCode} from '../stores/apiStore';
  import Actions  from './Actions.svelte';

  function filter(v) {
    if (/_template_/.test(v)) {
      return true
    } else {
      return !/^_/.test(v) 
    }
  }

  onMount(() => {
    const rpcs = {}
    let arr = Object.keys(window.RPC)
    arr = arr.filter(filter).sort()
    for (const key1 of arr) {
      rpcs[key1] = $rpc.rpc[key1] || {}
      for (const key2 in window.RPC[key1]) {
        if (!rpcs[key1][key2]) {
          rpcs[key1][key2] = {code: '...'}
        }
      }
    }
    rpc.update(_ => {
      return {rpc: rpcs}
    })
    if (RPC._obj_.argv.debug) {
      console.log('Script onmount!', rpcs)
    }
  })

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
          <pre>{$rpc.rpc[nspace] && $rpc.rpc[nspace][fn]?.code}</pre>
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
</style>
