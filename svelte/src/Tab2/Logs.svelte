<script>
  export let _req;
  export let logs;
  export let yaml;
  export let options;
  export let _grp = 'logs';
  export let _path = 'Logs/all@';
  import {toJson, toYaml} from '../lib/common';
  import {mouseOver} from '../stores/ttpStore';
  import {reqs} from '../stores/reqsStore';
  import Collapsible from '../components/Collapsible.svelte';
  import {
    no1,
    req,
    resp,
    date,
    elapse,
    toArray,
  } from '../Tab1/Tab1';
  import Copy from '../Tab1/Copy.svelte';

  function showDate(row) {
    const {autoShowDate, autoShowElapse} = options
    const arr = []
    if (autoShowDate) {
      arr.push(date(row))
    }
    if (autoShowElapse) {
      arr.push(elapse(row))
    }
    return arr.length ? `${arr.join('|')}` : ''
  }

  function openLog(row) {
    const l = row.openLog;
    return l;
  }

  export function clickSummary(evn, lg) {
    const ct = evn.currentTarget
    const el = ct.parentElement
    const {path} = ct.dataset
    const {id,name} = el.dataset
    setTimeout(()=>{
      if (name==='openLog') {
        logs[id][name] = !logs[id][name]
      } else {
        if (logs[id]._===undefined) {
          logs[id]._ = {}
        }
        logs[id]._[name] = !logs[id]._[name]
      }
      reqs.update(_ => {
        _.req = _req
        return _
      });
      const open = (typeof el.getAttribute('open')==='string')
    },10)
  }
</script>

{#each toArray(logs) as row}
  <Collapsible klas="logs-details_b" id={row._id} name=openLog open={openLog(row)}>
    <summary slot=head class="logs" on:click={e=>clickSummary(e, _grp)} data-path={`${_path}${row._id}`}>
      {no1(row)}.
      <span class="dtel">{@html showDate(row)}</span>[{req(row,'],method,url',options)}~>{row.rspcode}
    </summary>
    <div slot=body>
      <Copy _id={row._id} {logs}/>
      <div class="main-content">
        <Collapsible id={row._id} name=openRqs open={row?._?.openRqs}>
          <summary slot=head class="title-brown" on:click={e=>clickSummary(e, _grp)} data-path={`${_path}${row._id}/request`}>Request</summary >
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <div slot=body class="ttp" data-typ="reqs-content" on:mouseover={mouseOver}>
            {#if yaml}
              <pre><code class="language-yaml">{@html toYaml(row.request)}</code></pre>  
            {:else}
              <pre><code class="language-json">{@html toJson(row.request)}</code></pre>  
            {/if}  
          </div>
        </Collapsible>
        <Collapsible id={row._id} name=openVld open={row?._?.openVld} show={row.invalid}>
          <summary slot=head class="title-blue" on:click={e=>clickSummary(e,'logs')}>Validate</summary>
          <div slot=body class="ttp" data-typ="validate">
            {#if yaml}
              <pre><code class="language-yaml">{@html toYaml(row.validate)}</code></pre>
            {:else}
              <pre><code class="language-json">{@html toJson(row.validate)}</code></pre>
            {/if}
          </div>
        </Collapsible>
        <Collapsible id={row._id} name=openHdr open={row?._?.openHdr}>
          <summary slot=head class="title-blue" on:click={e=>clickSummary(e, _grp)} data-path={`${_path}${row._id}/resp-header`}>Response hdr</summary>
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <div slot=body class="ttp" data-typ="resp-header" on:mouseover={mouseOver}>
            <pre>{row.x_tag}</pre>
            {#if yaml}
              <pre><code class="language-yaml">{@html toYaml(resp(row))}</code></pre>
            {:else}
              <pre><code class="language-json">{@html toJson(resp(row))}</code></pre>
            {/if}
          </div>
        </Collapsible>
        <Collapsible id={row._id} name=openBody open={row?._?.openBody}>
          <summary slot=head class="title-blue" on:click={e=>clickSummary(e, _grp)} data-path={`${_path}${row._id}/resp-body`}>Response body</summary>
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <div slot=body class="ttp aliceblue" data-typ="resp-body" on:mouseover={mouseOver}>
              {#if yaml}
                <pre><code class="language-yaml">{@html toYaml(row.response)}</code></pre>
              {:else}
                <pre><code class="language-json">{@html toJson(row.response)}</code></pre>          
              {/if}
          </div>
        </Collapsible>
      </div>
    </div>
  </Collapsible>
{/each}

<style lang="scss">
  .title-brown {
    color: #db6b6b;
  }
  .title-blue {
    color: blue;
  }
  .main-header {
    padding-left: 15px;
  }
  .copylink {
    font-family: monospace;
  }
  :global(details.logs-details_b) {
    margin-left: 7px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    summary {
      font-size: 11px;
    }
    pre {
      font-size: 10px;
    }
  }
  summary.logs {
    color: rgb(132, 149, 199);
    font-weight: 100;
    white-space: nowrap;
    input {
      vertical-align: sub;
    }
    span {
      padding: 0 1px;
      color: chocolate;
      margin-left: -6px;
    }
  }
  [data-typ=resp-header] pre, 
  [data-typ=resp-body] pre, 
  [data-typ=reqs-content] {
    margin: 0;
  }
  [data-typ=reqs-content] {
    background-color: aliceblue;
  }
  [data-typ=resp-header] {
    background-color: antiquewhite;
  }
  .azure {
    background-color: azure;
  }
  .aliceblue {
    background-color: aliceblue;
  }
</style>
