<script>
  import {
    logs,
    limithdr,
    hideHost,
    showttips,
    autoShowlog,
    autoShowDate,
    autoShowElapse,
  } from './stores/logsStore';
  $: lhdr = $logs.options.limithdr;
  $: host = $logs.options.hideHost;
  $: tips = $logs.options.showttips;
  $: slog = $logs.options.autoShowlog;
  $: sdte = $logs.options.autoShowDate;
  $: selp = $logs.options.autoShowElapse;
</script>

<div class="commonlink">
  <label for="checkbkLmthdr">
    <input type="checkbox" id="checkbkLmthdr" on:click={limithdr} bind:checked={lhdr}>Limit Header
  </label>
  <ul>
    <li>
      <label for="checkbkShowlog">
        <input type="checkbox" id="checkbkShowlog" on:click={autoShowlog} bind:checked={slog}>Show-Logs
      </label>
    </li>
    <li>
      <label for="checkbkDate">
        <input type="checkbox" id="checkbkDate" on:click={autoShowDate} bind:checked={sdte}>Show date
      </label>
      <li>
        <label for="checkbkElapse">
          <input type="checkbox" id="checkbkElapse" on:click={autoShowElapse} bind:checked={selp}>Show elapse
        </label>
      </li>
      <li>
        <label for="checkbkDomain" class=purple>
          <input type="checkbox" id="checkbkDomain" on:click={hideHost} bind:checked={host}>Hide domain
        </label>
      </li>
      <li>
        <label for="checkbkTips" class=purple>
          <input type="checkbox" id="checkbkTips" on:click={showttips} bind:checked={tips}>Show TTips
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
    margin: -2px -7px 0 0;
    ul {
      display: block;
    }
  }
  .purple {
    color: purple;
  }
}
input {
  vertical-align: sub;
}
</style>