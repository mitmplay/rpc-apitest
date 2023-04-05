<script>
  import {logs, clickGroup, clickCollapse} from '../stores/logsStore';
  import Actions  from './Actions.svelte';
  import AllLogs  from './AllLogs.svelte';
  import GrpLogs  from './GrpLogs.svelte';
  import DateLogs from './DateLogs.svelte';
</script>

<section>
  <Actions />
  {#if $logs.options.grouping==='1'}
    <AllLogs  logs ={$logs.logs}/>
  {:else if $logs.options.grouping==='2'}
    <GrpLogs  logs2={$logs.logs2}/>
  {:else if $logs.options.grouping==='3'}
    <DateLogs logs3={$logs.logs3}/>
  {/if}
</section>

<style lang="scss">

</style>
