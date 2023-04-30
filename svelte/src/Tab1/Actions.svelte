<script>
  import {logs, clickGroup, clickYaml, clickCollapse} from '../stores/logsStore';
  $: grp = $logs.options.grouping;
  $: yml = $logs.options.yaml;
</script>

<div class=action>
  <button on:click={clickCollapse}>Collapse</button>
  <label><input type=radio on:click={clickGroup} bind:group={grp} name="all"  value="1">All</label>
  <label><input type=radio on:click={clickGroup} bind:group={grp} name="host" value="2">Host</label>
  <label><input type=radio on:click={clickGroup} bind:group={grp} name="time" value="3">Time</label>
  <label for="checkbk">
    <input type="checkbox" id="checkbk" on:click={clickYaml} bind:checked={yml}>Yaml
  </label>
</div>

<style lang="scss">

</style>
