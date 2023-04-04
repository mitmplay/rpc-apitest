<script>
  import {logs, clickGroup, clickCollapse} from '../stores/logsStore';
  import AllLogs from './AllLogs.svelte';
  import GrpLogs from './GrpLogs.svelte';
</script>

<section>
  <label><input type=radio on:click={clickGroup} bind:group={$logs.options.dnsGrouping} name="all"  value="1">All</label>
  <label><input type=radio on:click={clickGroup} bind:group={$logs.options.dnsGrouping} name="host" value="2">Host</label>
  <label><input type=radio on:click={clickGroup} bind:group={$logs.options.dnsGrouping} name="time" value="3">Time</label>
  <button on:click={clickCollapse}>Collapse</button>
  {#if $logs.options.dnsGrouping==='1'}
    <AllLogs logs ={$logs.logs}/>
  {:else if $logs.options.dnsGrouping==='2'}
    <GrpLogs logs2={$logs.logs2}/>
  {:else if $logs.options.dnsGrouping==='3'}
    <GrpLogs logs2={$logs.logs2}/>
  {/if}
</section>

<style lang="scss">

</style>
