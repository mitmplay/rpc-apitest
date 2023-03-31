<script>
  import {logs, clickSummary} from '../stores/logsStore';
  import {no1, date, meth, resp, trunc} from './Tab1';
</script>

<svelte:head>
  <title>Show Logs</title>
  <meta name="description" content="Showing some logs" />
</svelte:head>

<section>
  {#each $logs as row}
    <details data-id={row.id} data-name=open open={row.open}>
      <summary on:click={clickSummary}>
        {no1(row)}.[{date(row)}][{meth(row)}]{row.api}~>({row.rspcode})
      </summary>
      <div class="main-content">
        <details data-id={row.id} data-name=openhdr open={row.openhdr}>
          <summary on:click={clickSummary}>Response headers</summary>
          <div class="resp-content">
            <pre>{row.x_tag}</pre>
            <pre>{resp(row)}</pre>  
          </div>
        </details>
        <div class="sub-content">
          <div class="title aliceblue"><b>Response Body: {'{'}</b></div>
          <pre class="aliceblue">{trunc(row.response)}</pre>
          <div class="title azure"><b>Request: {'{'}</b></div>
          <pre class="azure">{trunc(row.request)}</pre>  
        </div>
      </div>
  </details>
  {/each}
</section>

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
