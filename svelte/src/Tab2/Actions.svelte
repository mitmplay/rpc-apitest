<script>
  import {
    reqs,
    clickCollapse,
    autoParsed,
    showSrc,
  } from '../stores/reqsStore';
  $: ssrc = $reqs.options.showSrc;
  $: prsd = $reqs.options.autoParsed;
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
</div>

<style lang="scss">
  [type="checkbox"] {
    vertical-align: sub;
  }
</style>
