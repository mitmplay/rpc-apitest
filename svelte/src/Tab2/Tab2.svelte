<script lang="ts">
  import CodeMirror from "./CodeMirror.svelte";
  let value = "";

  function toArray(json) {
    const arr = Object.keys(json)
    return arr.filter((v,i)=>!/^_/.test(v)).sort()
  }

  async function run(evn) {
    const {nspace,fn} = evn.target.dataset
    const msg = await window.RPC[nspace][fn]() 
  }
</script>

<svelte:head>
  <title>Show content</title>
  <meta name="description" content="Showing some contents" />
</svelte:head>

{#each toArray(window.RPC) as nspace}
<details>
  <summary>
    {nspace}
  </summary>
  <div>
    {#each toArray(window.RPC[nspace]) as fn}
      <details>
        <summary>
          <i>await</i> {`${nspace}`}.<b>{`${fn}`}</b>()
          <a href="#" data-nspace={nspace} data-fn={fn} on:click={run}>run</a>
        </summary>  
        <div>
          ...
        </div>
      </details>
    {/each}
  </div>
</details>
{/each}

<style lang="scss">
  summary{
    white-space: inherit;
  }
  details>div {
    padding-left: 12px;
  }
  i {
    color:crimson;
  }
  b {
    color:darkblue
  }
</style>
