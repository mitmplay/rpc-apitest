<script>
  export let logs2;
  export let yaml;
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
  <details data-id={row._id} data-name=openDns open={row.openDns}>
    <summary on:click={e=>clickSummary(e,'logs2')}>{row._id}</summary>
    <div><AllLogs logs={row.logs} {yaml}/></div>
</details>
{/each}

<style lang="scss">

</style>
