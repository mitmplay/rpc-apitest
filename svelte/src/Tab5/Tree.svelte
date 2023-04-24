<script>
  export let _doc
  export let json
  import {clickSummary} from '../stores/docsStore';
  import Tree from './Tree.svelte';

  function toArray(_json) {
    const arr1 = []
    const arr2 = []
    const arr3 = []
    for (const key in _json) {
      if (/_readme_/.test(key)) {
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
</script>

{#each toArray(json) as nspace}
<details data-nspace={nspace} data-name="_openName" open={json[nspace]._openName}>
  <summary on:click={evn => clickSummary(evn, _doc, json)}>
    {#if json[nspace].run}
      <b>{`${json[nspace].run.replace(/(^_|_$)/g, '')}`}</b>
    {:else}
      {nspace}
    {/if}
  </summary>
  {#if json[nspace].run}
    {#if json[nspace].content}
      <div id="markdown">
        {@html json[nspace].content}
      </div>
    {:else}
      <pre>...</pre>
    {/if}
  {:else}
    <div><Tree {_doc} json={json[nspace]} /></div>
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
