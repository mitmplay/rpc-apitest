<script>
  export let logs4;
  export let yaml;
  export let options;
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

{#each toArray(logs4) as row}
  <details data-id={row._id} data-name=domain open={row.domain}>
    <summary on:click={e=>clickSummary(e,'logs4')}>{row._id}</summary>
    <div><AllLogs logs={row.logs} {options} {yaml}/></div>
</details>
{/each}

<style lang="scss">

</style>
