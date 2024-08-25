<script>
  // @ts-nocheck
  import {
    logs, 
    clickYaml,
    clickGroup, 
    clickCollapse,
    clickSelectAll,
    autoExpandRequest,
    autoExpandRespHdr,
    autoExpandRespBody,
  } from '../stores/logsStore';
  import {remove} from './remove';
  import {download_html} from './download';
  
  $: grp = $logs.options.grouping;
  $: slc = $logs.options.selectAll;
  $: rqs = $logs.options.autoExpandRequest;
  $: hdr = $logs.options.autoExpandRespHdr;
  $: bdy = $logs.options.autoExpandRespBody;
  $: yml = $logs.options.yaml;

</script>

<div class=action>
  <button on:click={clickCollapse}>[-]</button>
  <button on:click={e=>remove(e, $logs)}>del</button>
  <label for="checkbkSlc">
    <input type="checkbox" id="checkbkSlc" on:click={clickSelectAll}  bind:checked={slc}>
  </label>
  <button on:click={e=>download_html(e, $logs)}>download</button>
  |
  <label><input type=radio on:click={clickGroup} bind:group={grp} name="all"  value="1">All</label>
  <label><input type=radio on:click={clickGroup} bind:group={grp} name="api"  value="2">Api</label>
  <label><input type=radio on:click={clickGroup} bind:group={grp} name="date" value="3">Date</label>
  <label><input type=radio on:click={clickGroup} bind:group={grp} name="Host" value="4">Host</label>
  |
  <label for="checkbkRqs">
    <input type="checkbox" id="checkbkRqs" on:click={autoExpandRequest}  bind:checked={rqs}>Reqs
  </label>
  <label for="checkbkHdr">
    <input type="checkbox" id="checkbkHdr" on:click={autoExpandRespHdr}  bind:checked={hdr}>Resp-hdr
  </label>
  <label for="checkbkBdy">
    <input type="checkbox" id="checkbkBdy" on:click={autoExpandRespBody} bind:checked={bdy}>Resp-body
  </label>
  |
  <label for="checkbkYml">
    <input type="checkbox" id="checkbkYml" on:click={clickYaml}          bind:checked={yml}>Yaml
  </label>
</div>

<style lang="scss">
  [type="checkbox"] {
    vertical-align: sub;
  }
</style>
