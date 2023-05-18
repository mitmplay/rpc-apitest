<script>
  export let _ns
  export let _req
  export let json
  import {logs, clickCollapse} from '../stores/logsStore';
  import {reqs, clickSummary}  from '../stores/reqsStore';
  import {mouseOver} from '../stores/ttpStore';
  import Tree from './Tree.svelte';
  import Envs from './Envs.svelte';
  import Slcs from './Slcs.svelte';

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

  function enf(req, ns) {
    const env = req[ns]?._template_?.env
    if (env && env!=='dev') {
      return `, {env: '${env}'}`
    } else {
      return ''
    }
  }

  async function run(evn, req, ns) {
    const {run} = evn.target.dataset
    console.log(`await RPC.api.fetch('${run}'${enf(req, ns)})`)
    let msg
    const env = req[ns]?._template_?.env
    if (env) {
      msg = await RPC.api.fetch(run, {env})
    } else {
      msg = await RPC.api.fetch(run)
    }
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

  function showRequest(nspace) {
    const {request, ori, src} = json[nspace]
    if ($reqs.options.autoParsed) {
      return request
    } else if ($reqs.options.showSrc) {
      return src
    } else {
      return ori
    }
  }

</script>

{#each toArray(json) as nspace}
<details data-nspace={nspace} data-name="_openName" open={json[nspace]._openName}>
  <summary on:click={evn => clickSummary(evn, json)}>
    {#if /_template_/.test(json[nspace].run)}
      <b>{`${json[nspace].run.split('/').pop()}`}</b>
    {:else if json[nspace].run}
      <i>await</i> RPC.api.fetch('<b>{`${json[nspace].run}`}'{enf($reqs.req, _ns)})</b>
      <a href="#" data-run={json[nspace].run} on:click={e=>run(e, $reqs.req, _ns)}>run</a>
    {:else}
      {nspace}
    {/if}
  </summary>
  {#if json[nspace]?._template_?.envs}
    <Envs ns={nspace}/>
  {:else if json[nspace]?._template_?.slcs}
    <Slcs json={json[nspace]._template_} ns={_ns}/>
  {/if}
  {#if json[nspace].run}
    <div class="ttp" data-typ="reqs-content" on:mouseover={mouseOver}>
      {#if RPC._obj_?.argv?.json}
        <pre class="aliceblue"><code class="language-json">{@html showRequest(nspace) || '...'}</code></pre>
      {:else}
        <pre class="aliceblue"><code class="language-yaml">{@html showRequest(nspace) || '...'}</code></pre>
      {/if}
    </div>
  {:else}
    <div><Tree {_req} json={json[nspace]} _ns={_ns || nspace} /></div>
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
