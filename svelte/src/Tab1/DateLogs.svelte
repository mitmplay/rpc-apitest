<script>
  export let logs3;
  export let yaml;
  export let options;
  import {clickSummary} from '../stores/logsStore';
  import Collapsible from '../components/Collapsible.svelte';
  import {
    toArray,
  } from './Tab1';
  import AllLogs from './AllLogs.svelte';
</script>

<svelte:head>
  <title>Show Group Logs</title>
  <meta name="description" content="Showing some logs" />
</svelte:head>

{#each toArray(logs3) as row}
  <Collapsible id={row._id} name=openDate open={row.openDate}>
    <summary slot=head on:click={e=>clickSummary(e,'logs3')}>{row._id}</summary>
    <div slot=body><AllLogs logs={row.logs} {options} {yaml}/></div>
  </Collapsible>
{/each}

<style lang="scss">
  
</style>
