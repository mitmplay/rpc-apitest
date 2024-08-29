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

  function arrLength(arr) {
    return (Array.isArray(arr)? arr.length : 0)
  }
</script>

{#each toArray(json) as nspace}
  <Collapsible {nspace} name=_openName open={json[nspace]._openName}>
    <summary slot=head on:click={evn => clickSummary(evn, _req, _ns, json)} data-path={`${_path}/${nspace}`}>
      {#if /_template_/.test(json[nspace].run)}
        <i>#</i>
      {:else if json[nspace].run}
        <i>await</i> RPC.api.fetch('<b>{`${json[nspace].run}`}{enf($reqs.req, _ns, json[nspace].run)}</b>)
        {#if json[nspace]?._runs}
          <Runs json={json[nspace]} {_req} {_ns}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class=_hover_ 
            data-run={json[nspace].run}
            on:click={e=>run(e, _ns, $reqs.req, $logs)}>
              {#if arrLength(json[nspace]?._run)}
                <i id={json[nspace]?._run ? json[nspace]?._run[0].replace('~', '_') : ''}>
                  &gt;{json[nspace]._run[0]+(json[nspace]._run.length>1?',.':'')}
                </i>
              {:else}
                <b>run<i>{json[nspace]?._runs.length>0 ? '(*)' : ''}</i></b>
              {/if}
            </div>
          </Runs>
        {:else}
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="#" class=_hover_ 
          data-run={json[nspace].run} 
          data-_run={json[nspace]._run || ''} 
          on:click={e=>run(e, _ns, $reqs.req, $logs)}><b>run</b></a>
        {/if}
      {:else}
        {nspace}
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
          {#if !/_template_/.test(json[nspace].run)}
            <Copy json={json[nspace].request} _ns={_ns} _run={json[nspace].run}/>
          {/if}
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <div class="ttp" data-typ="reqs-content" on:mouseover={mouseOver}>
            {#if RPC._obj_?.argv?.json}
              <pre class="aliceblue"><code class="language-json">{@html showRequest($logs.options, $reqs, nspace, json) || '...'}</code></pre>
            {:else}
              <pre class="aliceblue"><code class="language-yaml">{@html showRequest($logs.options, $reqs, nspace, json) || '...'}</code></pre>
            {/if}
          </div>
        {:else}
          <div><Tree {_req} json={json[nspace]} _ns={_ns || nspace} _path={`${_path}/${nspace}`}/></div>
        {/if}
      {/if}
    </div>
  </Collapsible>
{/each}

<style lang="scss">
  summary{
    white-space: inherit;
  }
  i {
    white-space: nowrap;
    color:crimson;
  }
  b {
    color:darkblue
  }
</style>
