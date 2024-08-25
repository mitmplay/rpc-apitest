<script>
  import {onMount} from 'svelte';
  import {logs, autoExpand} from '../stores/logsStore';
  import Actions from './Actions.svelte';
  import AllLogs from './AllLogs.svelte';
  import GrpLogs from './GrpLogs.svelte';

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    await window.RPC.api.peek()
    await autoExpand()
  })
</script>

<Actions />
<section>
  {#if $logs.options.grouping==='1'}
    <AllLogs logs ={$logs.logs } _grp={'logs' } options={$logs.options} yaml={$logs.options.yaml}/>
  {:else if $logs.options.grouping==='2'}
    <GrpLogs _logs={$logs.logs2} _grp={'logs2'} options={$logs.options} yaml={$logs.options.yaml}/>
  {:else if $logs.options.grouping==='3'}
    <GrpLogs _logs={$logs.logs3} _grp={'logs3'} options={$logs.options} yaml={$logs.options.yaml}/>
  {:else if $logs.options.grouping==='4'}
    <GrpLogs _logs={$logs.logs4} _grp={'logs4'} options={$logs.options} yaml={$logs.options.yaml}/>
  {/if}
</section>

<style lang="scss">

</style>
