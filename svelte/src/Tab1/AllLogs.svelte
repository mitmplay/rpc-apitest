<script>
  export let logs;
  import {clickSummary} from '../stores/logsStore';
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
          <pre>{row.request}</pre>  
        </div>
      </details>
      <details data-id={row._id} data-name=openHdr open={row.openHdr}>
        <summary on:click={e=>clickSummary(e,'logs')}>Response headers</summary>
        <div class="resp-content">
          <pre>{row.x_tag}</pre>
          <pre>{resp(row)}</pre>  
        </div>
      </details>
      <div class="sub-content">
        <div class="title aliceblue"><b>Response Body:</b></div>
        <pre class="aliceblue">{row.response}</pre>
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
    padding-left: 10px;
  }
  .reqs-content {
    margin-left: 10px;
    background-color: aliceblue;
  }
  .resp-content {
    margin-left: 10px;
    background-color: antiquewhite;
  }
  .resp-content pre {
    margin: 0;
  }
  .azure {
    background-color: azure;
  }
  .aliceblue {
    background-color: aliceblue;
  }
</style>
