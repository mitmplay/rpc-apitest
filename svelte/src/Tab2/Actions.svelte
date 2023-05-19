<script>
  import {
    reqs,
    clickCollapse,
    autoParsed,
    showSrc,
  } from '../stores/reqsStore';
  import {
    logs,
    clickTips,
  } from '../stores/logsStore';
  $: ssrc = $reqs.options.showSrc;
  $: prsd = $reqs.options.autoParsed;
  $: tip = $logs.options.tips;
</script>

<div class=action>
  <button on:click={clickCollapse}>[-]</button>
  |
  <label for="checkbkParsed">
    <input type="checkbox" id="checkbkParsed" on:click={autoParsed} bind:checked={prsd}>Parsed
  </label>
  <label for="checkbkSrc">
    <input type="checkbox" id="checkbkSrc" on:click={showSrc} bind:checked={ssrc}>Source
  </label>
  |
  <label for="checkbkTips">
    <input type="checkbox" id="checkbkTips" on:click={clickTips} bind:checked={tip}>TTips
  </label>
</div>

<style lang="scss">
  [type="checkbox"] {
    vertical-align: sub;
  }
</style>
