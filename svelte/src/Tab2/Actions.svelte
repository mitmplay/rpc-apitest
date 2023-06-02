<script>
  import {
    reqs,
    clickCollapse,
    autoParsed,
    showRvar,
    showSrc,
  } from '../stores/reqsStore';
  import {logs} from '../stores/logsStore';
  $: prsd = $reqs.options.autoParsed;
  $: rvar = $reqs.options.showRvar;
  $: ssrc = $reqs.options.showSrc;
</script>

<div class=action>
  <button on:click={clickCollapse}>[-]</button>
  |
  <label for="checkbkParsed">
    <input type="checkbox" id="checkbkParsed" on:click={autoParsed} bind:checked={prsd}>Parsed
  </label>
  <label for="checkbkRuns">
    <input type="checkbox" id="checkbkRuns" on:click={showRvar} bind:checked={rvar}>Req-var
  </label>
  <label for="checkbkSrc">
    <input type="checkbox" id="checkbkSrc" on:click={showSrc} bind:checked={ssrc}>Source
  </label>
</div>

<style lang="scss">
  [type="checkbox"] {
    vertical-align: sub;
  }
</style>
