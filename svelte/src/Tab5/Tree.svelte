<script>
  export let _doc
  export let json
  import {clickSummary} from '../stores/docsStore';
  import Tree from './Tree.svelte';
  import Collapsible from '../components/Collapsible.svelte';

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
  let mermaid;
  function content(src) {
    !mermaid && (mermaid = window.mermaid);
    setTimeout(() => {
      if (document.querySelector('#markdown .mermaid')) {
        mermaid.init();
      }
    }, 1);
    return src.content;
  }
</script>

{#each toArray(json) as nspace}
  <Collapsible {nspace} name=_openName open={json[nspace]._openName}>
    <summary slot=head on:click={evn => clickSummary(evn, _doc, json)}>
      {#if json[nspace].run}
        <b>{`${json[nspace].run.replace(/(^_|_|\.md$)/g, '').split('/').pop()}`}</b>
      {:else}
        {nspace}
      {/if}
    </summary>
    <div slot=body>
      {#if json[nspace].run}
        {#if json[nspace].content}
          <div id="markdown">
            {@html content(json[nspace])}
          </div>
        {:else}
          <pre>...</pre>
        {/if}
      {:else}
        <div><Tree {_doc} json={json[nspace]} /></div>
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
