<script>
  import {
    reqs,
    clickCollapse,
    autoShowlog,
    autoParsed,
  } from '../stores/reqsStore';
  $: slog = $reqs.options.autoShowlog;
  $: prsd = $reqs.options.autoParsed;
</script>

<div class=action>
  <button on:click={clickCollapse}>Collapse</button>
  |
  <label for="checkbkShowlog">
    <input type="checkbox" id="checkbkShowlog" on:click={autoShowlog} bind:checked={slog}>Show-log
  </label>
  <label for="checkbkParsed">
    <input type="checkbox" id="checkbkParsed" on:click={autoParsed} bind:checked={prsd}>Parsed
  </label>
</div>

<style lang="scss">

</style>
