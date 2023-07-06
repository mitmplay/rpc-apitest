<script>
  export let logs;
  export let yaml;
  export let options;
  import { mouseOver } from '../stores/ttpStore';
  import { toJson, toYaml } from '../lib/common';
  import {
    clickSummary,
    clickChecked
  } from '../stores/logsStore';
  import {
    no1,
    req,
    resp,
    date,
    elapse,
    toArray,
  } from './Tab1';
  import Copy from './Copy.svelte';

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
</script>

<svelte:head>
  <title>Show All Logs</title>
  <meta name="description" content="Showing some logs" />
</svelte:head>

{#each toArray(logs) as row}
  <details data-id={row._id} data-name=openLog open={row.openLog}>
    <summary class="logs" on:click={e=>clickSummary(e,'logs')}>
      {no1(row)}.<input type=checkbox on:click={clickChecked} bind:checked={row.chkLog}/>
      <span class="dtel">{@html showDate(row)}</span>[{req(row,'],method,url',options)}~>{row.rspcode}
    </summary>
    {#if row.openLog}
      <Copy _id={row._id} {logs}/>
      <div class="main-content">
        <details data-id={row._id} data-name=openRqs open={row.openRqs}>
          <summary class="title-brown" on:click={e=>clickSummary(e,'logs')}>Request</summary>
          <div class="ttp" data-typ="reqs-content" on:mouseover={mouseOver}>
            {#if yaml}
              <pre><code class="language-yaml">{@html toYaml(row.request)}</code></pre>  
            {:else}
              <pre><code class="language-json">{@html toJson(row.request)}</code></pre>  
            {/if}  
          </div>
        </details>
        {#if row.invalid!==null}
          <details data-id={row._id} data-name=openVld open={row.openVld}>
            <summary  class="title-blue" on:click={e=>clickSummary(e,'logs')}>Validate</summary>
            <div class="ttp" data-typ="validate">
              {#if yaml}
                <pre><code class="language-yaml">{@html toYaml(row.validate)}</code></pre>
              {:else}
                <pre><code class="language-json">{@html toJson(row.validate)}</code></pre>
              {/if}
            </div>
          </details>
        {/if}
        <details data-id={row._id} data-name=openHdr open={row.openHdr}>
          <summary  class="title-blue" on:click={e=>clickSummary(e,'logs')}>Response hdr</summary>
          <div class="ttp" data-typ="resp-header" on:mouseover={mouseOver}>
            <pre>{row.x_tag}</pre>
              {#if yaml}
                <pre><code class="language-yaml">{@html toYaml(resp(row))}</code></pre>
              {:else}
                <pre><code class="language-json">{@html toJson(resp(row))}</code></pre>
              {/if}
          </div>
        </details>
        <details data-id={row._id} data-name=openBody open={row.openBody}>
          <summary class="title-blue" on:click={e=>clickSummary(e,'logs')}>Response body</summary>
          <div class="ttp aliceblue" data-typ="resp-body" on:mouseover={mouseOver}>
              {#if yaml}
                <pre><code class="language-yaml">{@html toYaml(row.response)}</code></pre>
              {:else}
                <pre><code class="language-json">{@html toJson(row.response)}</code></pre>          
              {/if}
          </div>
        </details>
      </div>
    {/if}  
</details>
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
  summary.logs {
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
