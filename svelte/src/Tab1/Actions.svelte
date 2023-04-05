<script>
    import {logs, clickGroup, clickCollapse} from '../stores/logsStore';
    $: grp = $logs.options.grouping;
</script>

<label><input type=radio on:click={clickGroup} bind:group={grp} name="all"  value="1">All</label>
<label><input type=radio on:click={clickGroup} bind:group={grp} name="host" value="2">Host</label>
<label><input type=radio on:click={clickGroup} bind:group={grp} name="time" value="3">Time</label>
<button on:click={clickCollapse}>Collapse</button>

<style lang="scss">

</style>
