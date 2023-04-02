<script>
  export let logs2;
  import {clickSummary} from '../stores/logsStore';
  import {
    toArray,
  } from './Tab1';
  import AllLogs from './AllLogs.svelte';
</script>

<svelte:head>
  <title>Show Group Logs</title>
  <meta name="description" content="Showing some logs" />
</svelte:head>

{#each toArray(logs2) as row}
  <details data-id={row._id} data-name=open open={row.open}>
    <summary on:click={clickSummary}>{row._id}</summary>
    <AllLogs logs={row.logs}/>
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
