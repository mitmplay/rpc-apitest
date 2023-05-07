<script>
  import {
    reqs,
    clickCollapse,
    autoParsed,
  } from '../stores/reqsStore';
  $: prsd = $reqs.options.autoParsed;
</script>

<div class=action>
  <button on:click={clickCollapse}>Collapse</button>
  |
  <label for="checkbkParsed">
    <input type="checkbox" id="checkbkParsed" on:click={autoParsed} bind:checked={prsd}>Parsed
  </label>
</div>

<style lang="scss">

</style>
