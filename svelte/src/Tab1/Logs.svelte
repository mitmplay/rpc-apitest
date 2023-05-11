<script>
  import {logs}   from '../stores/logsStore';
  import Actions  from './Actions.svelte';
  import AllLogs  from './AllLogs.svelte';
  import GrpLogs  from './GrpLogs.svelte';
  import DateLogs from './DateLogs.svelte';
</script>

<Actions />
<section>
  {#if $logs.options.grouping==='1'}
    <AllLogs  logs ={$logs.logs} options={$logs.options} yaml={$logs.options.yaml}/>
  {:else if $logs.options.grouping==='2'}
    <GrpLogs  logs2={$logs.logs2} options={$logs.options} yaml={$logs.options.yaml}/>
  {:else if $logs.options.grouping==='3'}
    <DateLogs logs3={$logs.logs3} options={$logs.options} yaml={$logs.options.yaml}/>
  {/if}
</section>

<style lang="scss">

</style>
