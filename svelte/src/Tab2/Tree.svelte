<script>
  export let _ns
  export let _req
  export let _path
  export let json
  import {enf}         from './lib/enf';
  import {run}         from './lib/run';
  import {toArray}     from './lib/to-array';
  import {showRequest} from './lib/show-request';
  import {mouseOver}   from '../stores/ttpStore';
  import {logs}        from '../stores/logsStore';
  import {reqs, clickSummary} from '../stores/reqsStore';
  import Collapsible from '../components/Collapsible.svelte';
  import Tree from './Tree.svelte';
  import Envs from './Envs.svelte';
  import Runs from './Runs.svelte';
  import Slcs from './Slcs.svelte';
  import Copy from './Copy.svelte';
  import Arrow   from '../svg/arrow.svelte';
  import Circle  from '../svg/circle.svelte';
  import Logs from './Logs.svelte';
  
  function expandChildren(e) {
    e.preventDefault()
    // e.stopPropagation()
    const targetEl = e.currentTarget
    const parentEl = targetEl.parentElement
    const detailEl = parentEl.parentElement
    const _path_ = targetEl.dataset.path.split('/')
    let req = $reqs.req
    for (const p of _path_) {
      req = req[p]
    }
    if (!req._openName) {
      parentEl.click()
    }
    setTimeout(()=> {
      const els = detailEl.querySelectorAll('details')
      els.forEach(el2=>{
        const el3 = el2.querySelector('summary')
        const xpath = el3.dataset.x
        if (xpath && (_path_.length+1)===xpath.split('/').length) {
          el3.click()
        }
      })
    }, 100)
  }
  function arrLength(arr) {
    return (Array.isArray(arr)? arr.length : 0)
  }
  function templateMenu(obj) {
    const l1 = /_template_/.test(obj.run)
    if (l1) {
      const l2 = obj._envs?.length
      const l3 = obj._slcs?.length
      return l2 || l3
    } else {
      return false
    }
  }
  function runIds(_run) {
    const result = _run ? _run.map(x=>x.replace(/[~:]+/g, '_')) : []
    return result.join('-')
  }
  function showLogs(reqs, json) {
    const opt = reqs.options.showLog
    if (json.logs) {
      const log = Object.keys(json.logs).length>0 
      return opt && log
    } else {
      return false
    }
  }
</script>

{#each toArray(json) as nspace, index}
  {#if !$reqs.options.showTemplate && templateMenu(json[nspace])}
    <div class="normal"><b class="dot"><Circle/></b>&nbsp;<i>#</i></div>
  {/if}
  {#if !/_template_/.test(json[nspace].run) || (json[nspace]?._template_?._envs || $reqs.options.showTemplate)}
  <Collapsible {nspace} name=_openName open={json[nspace]._openName}>
    <summary slot=head on:click={evn => clickSummary(evn, _req, _ns, json)} 
      data-path={`${_path}/${nspace}`} data-x={json[nspace]?.run}>
      {#if /_template_/.test(json[nspace].run)}
        <b class="dot"><Circle/></b>
        <i>#</i>
      {:else if json[nspace].run}
        <b class="dot"><Circle/></b>
        {#if $reqs.options.showRpc}
          <i class="await">await</i> RPC.api.fetch('<b>{`${json[nspace].run}`}{enf($reqs.req, _ns, json[nspace].run)}</b>)
        {:else}          
          <i class="{json[nspace].ori ? 'ori':'file'}">{json[nspace].run.split('/').pop()}</i>
        {/if}
        {#if json[nspace]?._runs}
          <Runs json={json[nspace]} {_req} {_ns} runIds={runIds(json[nspace]?._run)}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class=_hover_ 
            data-run={json[nspace].run}
            on:click={e=>run(e, _ns, $reqs.req, $logs)}>
              {#if arrLength(json[nspace]?._run)}
                <i class="run" id={runIds(json[nspace]?._run)}>
                  &gt;{json[nspace]._run[0]+(json[nspace]._run.length>1?',.':'')}
                </i>
              {:else}
                <b class="run">run<i class="run">{json[nspace]?._runs.length>0 ? '(*)' : ''}</i></b>
              {/if}
            </div>
          </Runs>
        {:else}
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="#" class=_hover_ 
          data-run={json[nspace].run} 
          data-_run={json[nspace]._run || ''} 
          on:click={e=>run(e, _ns, $reqs.req, $logs)}>
            <b class="run">run</b>
          </a>
        {/if}
      {:else}
        <b class="expand" on:click={expandChildren} data-path={json[nspace]._path_}><Arrow/></b>
        <i class="ns_{_path.split('/').length}">
          {nspace}
        </i>
      {/if}
    </summary>
    <div slot=body>
      {#if json[nspace]?._openName}
        {#if json[nspace]?._template_?._envs}
          <Envs ns={nspace}/>
        {:else if json[nspace]?._template_?._slcs}
          <Slcs json={json[nspace]._template_} {_req} {_ns}/>
        {/if}
        {#if json[nspace].run}
          {#if !/_template_/.test(json[nspace].run) && $reqs.options.showCommand}
            <Copy json={json[nspace].request} _ns={_ns} _run={json[nspace].run} _idx={index}/>
          {/if}
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <div class="ttp" data-typ="reqs-content" on:mouseover={mouseOver}>
            {#if RPC._obj_?.argv?.json}
              <pre class="aliceblue"><code class="language-json">{@html showRequest($logs.options, $reqs, nspace, json) || '...'}</code></pre>
            {:else}
              <pre class="aliceblue"><code class="language-yaml">{@html showRequest($logs.options, $reqs, nspace, json) || '...'}</code></pre>
            {/if}
            {#if showLogs($reqs, json[nspace])}
              <Logs {_req} logs={json[nspace].logs} _grp={'logs'} options={$logs.options} yaml={$logs.options.yaml}/>
            {/if}
          </div>
        {:else}
          <div><Tree {_req} json={json[nspace]} _ns={_ns || nspace} _path={`${_path}/${nspace}`}/></div>
        {/if}
      {/if}
    </div>
  </Collapsible>
  {/if}
{/each}

<style lang="scss">
  summary{
    white-space: inherit;
  }
  i {
    white-space: nowrap;
    &.ns_1 {
      text-decoration: underline;
      font-style: italic;
    }
    &.ns_2 {
      margin-left: -5px;
    }
    &.ns_1,&.ns_2,&.ns_3,&.ns_4 {
      font-style: normal;
      font-weight: 100;
      color: darkblue;
    }
    &.await, &.run {
      color:crimson;
    }
    &.file {
      font-style: normal;
      font-weight: 100;
      color: teal;
    }
    &.ori {
      font-style: normal;
      color: teal;
    }
  }
  .ttp>pre {
    padding-left: 5px;
  }
  b {
    color:darkblue;
    &.run {
      color: red;
    }
  }
  .normal {
    font-size: 12px;
    font-weight: bold;
    font-family: monospace;
    padding-left: 13px;
  }
  b.dot {
    color: #e4c9c9;
  }
</style>
