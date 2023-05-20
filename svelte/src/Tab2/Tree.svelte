<script>
  export let _ns
  export let _req
  export let json
  import {logs, clickCollapse} from '../stores/logsStore';
  import {reqs, clickSummary}  from '../stores/reqsStore';
  import {mouseOver} from '../stores/ttpStore';
  import { pretty } from '../lib/common';
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

  function enf(req, ns, run) {
    const {env} = req[ns]._template_
    const opt = env ? [`env:'${env}'`] : []

    let sec = req[ns]
    run.split('/').slice(1,-1).forEach(k=>{
      sec = sec[k]
      if (sec._template_.slc) {
        opt.push(`slc:'${sec._template_.slc}'`)
      }
    })
    if (opt.length===0) {
      return ''
    }
    return `,{${opt.join(',')}}`
  }

  async function run(evn, req, ns) {
    const {run} = evn.target.dataset

    const env = req[ns]?._template_?.env
    const opt = {}

    let sec = req[ns]
    run.split('/').slice(1,-1).forEach(k=>{
      sec = sec[k]
      if (sec._template_.slc) {
        opt.slc = sec._template_.slc
      }
    })
    if (env) {
      opt.env = env
    }
    console.log(`await RPC.api.fetch('${run}', ${JSON.stringify(opt)})`)
    let msg = await RPC.api.fetch(run, opt)
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

  function showRequest({options}, nspace) {
    let _code
    const {request, ori, src} = json[nspace]
    if (options.showSrc) {
      _code = pretty(src || '', true)
    } else {
      if (options.autoParsed) {
        _code = request
      } else {
        _code = ori
      }
      _code = pretty(_code || '')
    }
    return _code
  }

</script>

{#each toArray(json) as nspace}
<details data-nspace={nspace} data-name="_openName" open={json[nspace]._openName}>
  <summary on:click={evn => clickSummary(evn, _req, _ns, json)}>
    {#if /_template_/.test(json[nspace].run)}
      <b>{`${json[nspace].run.split('/').pop()}`}</b>
    {:else if json[nspace].run}
      <i>await</i> RPC.api.fetch('<b>{`${json[nspace].run}`}{enf($reqs.req, _ns, json[nspace].run)})</b>
      <a href="#" class=_hover_ data-run={json[nspace].run} on:click={e=>run(e, $reqs.req, _ns)}>run</a>
    {:else}
      {nspace}
    {/if}
  </summary>
  {#if json[nspace]?._template_?.envs}
    <Envs ns={nspace}/>
  {:else if json[nspace]?._template_?.slcs}
    <Slcs json={json[nspace]._template_} {_req} {_ns}/>
  {/if}
  {#if json[nspace].run}
    <div class="ttp" data-typ="reqs-content" on:mouseover={mouseOver}>
      {#if RPC._obj_?.argv?.json}
        <pre class="aliceblue"><code class="language-json">{@html showRequest($reqs, nspace) || '...'}</code></pre>
      {:else}
        <pre class="aliceblue"><code class="language-yaml">{@html showRequest($reqs, nspace) || '...'}</code></pre>
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
