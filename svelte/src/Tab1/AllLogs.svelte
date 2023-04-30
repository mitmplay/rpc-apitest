<script>
  export let logs;
  export let yaml;
  import {clickSummary} from '../stores/logsStore';
  import { toJson, toYaml } from '../lib/common';
  import {
    no1,
    req,
    date,
    resp,
    toArray,
  } from './Tab1';
</script>

<svelte:head>
  <title>Show All Logs</title>
  <meta name="description" content="Showing some logs" />
</svelte:head>

{#each toArray(logs) as row}
  <details data-id={row._id} data-name=openLog open={row.openLog}>
    <summary on:click={e=>clickSummary(e,'logs')}>
      {no1(row)}.[{date(row)}][{req(row,'],method,url')}~>({row.rspcode})
    </summary>
    <div class="main-content">
      <details data-id={row._id} data-name=openRqs open={row.openRqs}>
        <summary on:click={e=>clickSummary(e,'logs')}>Request</summary>
        <div class="reqs-content">
        {#if yaml}
          <pre><code class="language-yaml">{@html toYaml(row.request)}</code></pre>  
        {:else}
          <pre><code class="language-json">{@html toJson(row.request)}</code></pre>  
        {/if}
        </div>
      </details>
      <details data-id={row._id} data-name=openHdr open={row.openHdr}>
        <summary on:click={e=>clickSummary(e,'logs')}>Response headers</summary>
        <div class="resp-content">
          <pre>{row.x_tag}</pre>
          {#if yaml}
            <pre><code class="language-yaml">{@html toYaml(resp(row))}</code></pre>
          {:else}
            <pre><code class="language-json">{@html toJson(resp(row))}</code></pre>
          {/if}
        </div>
      </details>
      <div class="sub-content">
        <div class="title"><b>Response Body:</b></div>
        {#if yaml}
          <pre class="aliceblue"><code class="language-yaml">{@html toYaml(row.response)}</code></pre>
        {:else}
          <pre class="aliceblue"><code class="language-json">{@html toJson(row.response)}</code></pre>          
        {/if}
      </div>
    </div>
</details>
{/each}

<style lang="scss">
  .title>b {
    color: blue;
    font-size: 12px;
    font-weight: bold;
    font-family: monospace;
  }
  .main-content {
    padding-left: 15px;
  }
  .sub-content {
    pre {
      padding-left: 10px;
    }
  }
  .reqs-content {
    margin-left: 10px;
    background-color: aliceblue;
  }
  .resp-content {
    background-color: antiquewhite;
  }
  .resp-content pre, .reqs-content {
    margin: 0;
  }
  .azure {
    background-color: azure;
  }
  .aliceblue {
    background-color: aliceblue;
  }
</style>
