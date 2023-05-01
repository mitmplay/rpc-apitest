<script>
  import {
    logs, 
    clickYaml, 
    clickGroup, 
    clickCollapse,
    autoExpandRequest,
    autoExpandRespHdr,
    autoExpandRespBody,
  } from '../stores/logsStore';
  $: grp = $logs.options.grouping;
  $: yml = $logs.options.yaml;
  $: rqs = $logs.options.autoExpandRequest;
  $: hdr = $logs.options.autoExpandRespHdr;
  $: bdy = $logs.options.autoExpandRespBody;
</script>

<div class=action>
  <button on:click={clickCollapse}>Collapse</button>
  |
  <label><input type=radio on:click={clickGroup} bind:group={grp} name="all"  value="1">All</label>
  <label><input type=radio on:click={clickGroup} bind:group={grp} name="host" value="2">Host</label>
  <label><input type=radio on:click={clickGroup} bind:group={grp} name="time" value="3">Time</label>
  |
  <label for="checkbkRqs">
    <input type="checkbox" id="checkbkRqs" on:click={autoExpandRequest}  bind:checked={rqs}>Request
  </label>
  <label for="checkbkHdr">
    <input type="checkbox" id="checkbkHdr" on:click={autoExpandRespHdr}  bind:checked={hdr}>Response-hdr
  </label>
  <label for="checkbkBdy">
    <input type="checkbox" id="checkbkBdy" on:click={autoExpandRespBody} bind:checked={bdy}>Respoonse-body
  </label>
  |
  <label for="checkbkYml">
    <input type="checkbox" id="checkbkYml" on:click={clickYaml}          bind:checked={yml}>Yaml
  </label>
</div>

<style lang="scss">

</style>
