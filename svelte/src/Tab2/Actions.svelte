<script>
  import {
    reqs,
    autoParsed,
    clickCollapse,
    showTemplate,
    showCommand,
    showHidden,
    showHeader,
    showSource,
  } from '../stores/reqsStore';

  $: prsd = $reqs.options.autoParsed;
  $: hdrs = $reqs.options.showHeader;
  $: hidn = $reqs.options.showHidden;
  $: ssrc = $reqs.options.showSource;
  $: scmd = $reqs.options.showCommand;
  $: stpl = $reqs.options.showTemplate;
</script>

<div class=action>
  <button on:click={clickCollapse}>[-]</button>
  |
  <label for="checkbkCommand">
    <input type="checkbox" id="checkbkCommand" on:click={showCommand}   bind:checked={scmd}>Cmd
  </label>
  |
  <label for="checkbkParsed">
    <input type="checkbox" id="checkbkParsed"  on:click={autoParsed}    bind:checked={prsd}>Parsed
  </label>
  <label for="checkbkHdrs">
    <input type="checkbox" id="checkbkHdrs"    on:click={showHeader}    bind:checked={hdrs}>Header
  </label>
  |
  <label for="checkbkTemplate">
    <input type="checkbox" id="checkbkTemplate" on:click={showTemplate} bind:checked={stpl}>Template
  </label>
  <label for="checkbkRuns">
    <input type="checkbox" id="checkbkRuns"    on:click={showHidden}    bind:checked={hidn}>Vars
  </label>
  |
  <label for="checkbkSrcs">
    <input type="checkbox" id="checkbkSrcs"     on:click={showSource}   bind:checked={ssrc}>Source
  </label>
</div>

<style lang="scss">
  [type="checkbox"] {
    vertical-align: sub;
  }
</style>
