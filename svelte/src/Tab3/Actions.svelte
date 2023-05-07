<script>
  import {
    rpc,
    clickCollapse,
    autoShowlog,
  } from '../stores/apiStore';
  $: slog = $rpc.options.autoShowlog;
</script>

<div class=action>
  <button on:click={clickCollapse}>Collapse</button>
  <label for="checkbkShowlog">
    <input type="checkbox" id="checkbkShowlog" on:click={autoShowlog} bind:checked={slog}>Show-log
  </label>  
</div>

<style lang="scss">

</style>
