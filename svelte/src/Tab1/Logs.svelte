<script>
  import {logs}   from '../stores/logsStore';
  import Actions  from './Actions.svelte';
  import AllLogs  from './AllLogs.svelte';
  import ApiLogs  from './ApiLogs.svelte';
  import DateLogs from './DateLogs.svelte';
  import HostLogs from './HostLogs.svelte';
</script>

<Actions />
<section>
  {#if $logs.options.grouping==='1'}
    <AllLogs  logs ={$logs.logs } options={$logs.options} yaml={$logs.options.yaml}/>
  {:else if $logs.options.grouping==='2'}
    <ApiLogs  logs2={$logs.logs2} options={$logs.options} yaml={$logs.options.yaml}/>
    {:else if $logs.options.grouping==='3'}
    <DateLogs logs3={$logs.logs3} options={$logs.options} yaml={$logs.options.yaml}/>
  {:else if $logs.options.grouping==='4'}
    <HostLogs logs4={$logs.logs4} options={$logs.options} yaml={$logs.options.yaml}/>
  {/if}
</section>

<style lang="scss">

</style>
