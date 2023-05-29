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
  import Runs from './Runs.svelte';
  import Slcs from './Slcs.svelte';
  import Copy from './Copy.svelte';

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
    const {_env} = req[ns]._template_

    let _slc= []
    let sec = req[ns]
    run.split('/').slice(1,-1).forEach(k=>{
      sec = sec[k]
      if (sec?._template_?._slc) {
        _slc = sec._template_._slc
      }
    })
    return _env||_slc?.length ? `',.`: `'`
  }

  async function run(evn, req, ns) {
    evn.preventDefault()
    const {run, _run} = evn.target.parentElement.dataset
    const _env = req[ns]?._template_?._env

    const opt = {}
    _env && (opt.env = _env)
    _run && (opt.run = _run)

    let sec = req[ns]
    run.split('/').slice(1,-1).forEach(k=>{ //# getting slc correct-way
      sec = sec[k]
      if (sec?._template_?._slc) {
        opt.slc = sec._template_._slc
      }
    })

    const arr = await RPC.api.request(run, opt)
    const msg = JSON.stringify(arr[0], null, 2)
    if (msg.match(/(undefined|\{\w+\})/)) {
      alert(`WARNING: Request having UN-parsed !\n${msg}`)
    } else {
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
  }

  function _novar(_ori) {
    for (const key in _ori) {
      if (key[0]==='_') {
        delete _ori[key]
      } else if (typeof _ori[key]==='object') {
        if (_ori[key]!==null || !Array.isArray(_ori[key])) {
          _novar(_ori[key])
        }
      }
    }
    return _ori
  }

  function showRequest({options}, nspace) {
    let _code = {}
    const {request, ori, src} = json[nspace]
    if (options.showSrc) {
      _code = pretty(src || '', true)
    } else {
      if (options.autoParsed && request) {
        const _ori1 = JSON.parse(JSON.stringify(request))
        const _ori2 = _novar(_ori1)
        _code = _ori2
      } else {
        if (nspace!=='_template_') {
          const {env, runs, ...orix} = ori || {}
          const _ori1 = JSON.parse(JSON.stringify(orix))
          const _ori2 = _novar(_ori1)
          _code = _ori2
        } else if (ori){
          const _ori1 = JSON.parse(JSON.stringify(ori))
          const _ori2 = _novar(_ori1)
          _code = _ori2
        }
      }
      _code = pretty(_code || '') //hljs-string">&quot;{
    }
    const rgx_undef1 = /(hljs-string)">&(quot|#x27);{[\w&.:;-]+}/g
    const rgx_undef2 = /(hljs-string).+undefined/g
    if (_code.match(rgx_undef1)) {
      _code = _code.replace(rgx_undef1, p1=> `undefined ${p1}`)
    } else if (_code.match(rgx_undef2)) {
      _code = _code.replace(rgx_undef2, p1=> `undefined ${p1}`)
    }
    return _code
  }

</script>

{#each toArray(json) as nspace}
<details data-nspace={nspace} data-name="_openName" open={json[nspace]._openName}>
  <summary on:click={evn => clickSummary(evn, _req, _ns, json)}>
    {#if /_template_/.test(json[nspace].run)}
      <i>#</i>
    {:else if json[nspace].run}
      <i>await</i> RPC.api.fetch('<b>{`${json[nspace].run}`}{enf($reqs.req, _ns, json[nspace].run)}</b>)
      {#if json[nspace]?._runs}
        <Runs json={json[nspace]} {_req} {_ns}>
          <div class=_hover_ 
          data-run={json[nspace].run} 
          data-_run={json[nspace]._run || ''} 
          on:click={e=>run(e, $reqs.req, _ns)}>
            {#if json[nspace]?._run}
              <i>&gt;{json[nspace]?._run}</i>
            {:else}
              <b>run<i>{json[nspace]?._runs.length>0 ? '*' : ''}</i></b>
            {/if}
          </div>
        </Runs>
      {:else}
        <a href="#" class=_hover_ 
        data-run={json[nspace].run} 
        data-_run={json[nspace]._run || ''} 
        on:click={e=>run(e, $reqs.req, _ns)}><b>run</b></a>
      {/if}
    {:else}
      {nspace}
    {/if}
  </summary>
  {#if json[nspace]?._template_?._envs}
    <Envs ns={nspace}/>
  {:else if json[nspace]?._template_?._slcs}
    <Slcs json={json[nspace]._template_} {_req} {_ns}/>
  {/if}
  {#if json[nspace].run}
    {#if !/_template_/.test(json[nspace].run)}
      <Copy json={json[nspace].request}/>
    {/if}
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
