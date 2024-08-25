<script>
  export let _logs;
  export let _grp;
  export let yaml;
  export let options;
  import {clickSummary} from '../stores/logsStore';
  import Collapsible from '../components/Collapsible.svelte';
  import {
    toArray,
  } from './Tab1';
  import AllLogs from './AllLogs.svelte';

  const group = {
    logs : 'all',
    logs2: 'api',
    logs3: 'date',
    logs4: 'host',
  }

  const _path = `Logs/${group[_grp]}@`;
</script>

<svelte:head>
  <title>Show Group Logs</title>
  <meta name="description" content="Showing some logs" />
</svelte:head>

{#each toArray(_logs) as row}
  <Collapsible id={row._id} name=openGrp open={row?._?.openGrp}>
    <summary slot=head on:click={e=>clickSummary(e, _grp)} data-path={`${_path}${row._id}`}>{row._id}</summary>
    <div slot=body>
      <AllLogs logs={row.logs} {options} {yaml} _path={`${_path}${row._id}/`}/>
    </div>
  </Collapsible>
{/each}

<style lang="scss">

</style>
