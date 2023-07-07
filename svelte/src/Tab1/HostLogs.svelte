<script>
  export let logs4;
  export let yaml;
  export let options;
  import {clickSummary} from '../stores/logsStore';
  import Collapsible from '../components/Collapsible.svelte';
  import {
    sortID,
    toArray,
  } from './Tab1';
  import AllLogs from './AllLogs.svelte';
</script>

<svelte:head>
  <title>Show Group Logs</title>
  <meta name="description" content="Showing some logs" />
</svelte:head>

{#each toArray(logs4).sort(sortID) as row}
  <Collapsible id={row._id} name=openDomain open={row.openDomain}>
    <summary slot=head on:click={e=>clickSummary(e,'logs4')}>{row._id}</summary>
    <div slot=body><AllLogs logs={row.logs} {options} {yaml}/></div>
  </Collapsible>
{/each}

<style lang="scss">

</style>
