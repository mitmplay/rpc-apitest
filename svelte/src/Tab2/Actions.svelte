<script>
  import {
    reqs,
    clickCollapse,
    autoParsed,
    showHidden,
    showSource,
  } from '../stores/reqsStore';
  import {logs} from '../stores/logsStore';
  $: prsd = $reqs.options.autoParsed;
  $: hidn = $reqs.options.showHidden;
  $: ssrc = $reqs.options.showSource;
</script>

<div class=action>
  <button on:click={clickCollapse}>[-]</button>
  |
  <label for="checkbkParsed">
    <input type="checkbox" id="checkbkParsed" on:click={autoParsed} bind:checked={prsd}>Parsed
  </label>
  <label for="checkbkRuns">
    <input type="checkbox" id="checkbkRuns" on:click={showHidden} bind:checked={hidn}>Hidden
  </label>
  <label for="checkbkSrc">
    <input type="checkbox" id="checkbkSrc" on:click={showSource} bind:checked={ssrc}>Source
  </label>
</div>

<style lang="scss">
  [type="checkbox"] {
    vertical-align: sub;
  }
</style>
