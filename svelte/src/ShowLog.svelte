<script>
  import {
    logs,
    autoShowlog,
    autoShowDate,
    autoShowElapse,
  } from './stores/logsStore';
  $: slog = $logs.options.autoShowlog;
  $: sdte = $logs.options.autoShowDate;
  $: selp = $logs.options.autoShowElapse;
</script>

<div class="commonlink">
  <label for="checkbkShowlog">
    <input type="checkbox" id="checkbkShowlog" on:click={autoShowlog} bind:checked={slog}>Show-Logs
  </label>
  <ul>
    <li>
      <label for="checkbkDate">
        <input type="checkbox" id="checkbkDate" on:click={autoShowDate} bind:checked={sdte}>Show date
      </label>
    <li>
      <label for="checkbkElapse">
        <input type="checkbox" id="checkbkElapse" on:click={autoShowElapse} bind:checked={selp}>Show elapse
      </label>
    </li>
  </ul>  
</div>

<style lang="scss">
.commonlink {
  position: relative;
  border: 1px solid white;
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: none;
  }
  &:hover {
    border: solid gray;
    background-color: azure;
    ul {
      display: block;
    }
  }
}
input {
  vertical-align: sub;
}
</style>