<script>
  import {logs}  from '../stores/logsStore';
  import AllLogs from './AllLogs.svelte';
  import GrpLogs from './GrpLogs.svelte';
</script>

<section>
{#if $logs.options.dnsGrouping}
  <GrpLogs logs2={$logs.logs2}/>
{:else}
  <AllLogs logs={$logs.logs}/>
{/if}
</section>

<style lang="scss">

</style>
