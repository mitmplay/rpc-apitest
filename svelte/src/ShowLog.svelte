<script>
  import {
    logs,
    autoShowlog,
  } from './stores/logsStore';
  $: slog = $logs.options.autoShowlog;
</script>

<label for="checkbkShowlog">
  <input type="checkbox" id="checkbkShowlog" on:click={autoShowlog} bind:checked={slog}>Show-Logs
</label>

<style lang="scss">
  input {
    vertical-align: sub;
  }
</style>