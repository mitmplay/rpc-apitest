<script>
  import {logs, clickGroup, clickCollapse} from '../stores/logsStore';
  import AllLogs from './AllLogs.svelte';
  import GrpLogs from './GrpLogs.svelte';
</script>

<section>
  <label>
    <input type="checkbox" on:click={clickGroup} checked={$logs.options.dnsGrouping}>
    Host
  </label>
  <button on:click={clickCollapse}>Collapse</button>
  {#if $logs.options.dnsGrouping}
    <GrpLogs logs2={$logs.logs2}/>
  {:else}
    <AllLogs logs={$logs.logs}/>
  {/if}
</section>

<style lang="scss">

</style>
