<script>
  import {reqs, actionEvents} from '../stores/reqsStore';
  const {
    autoParsed,
    clickCollapse,
    showTemplate,
    showCommand,
    showHidden,
    showHeader,
    showSource,
    showClr,
    showRpc,
    showLog,
  } = actionEvents()
  
  $: prsd = $reqs.options.autoParsed;
  $: hdrs = $reqs.options.showHeader;
  $: hidn = $reqs.options.showHidden;
  $: ssrc = $reqs.options.showSource;
  $: scmd = $reqs.options.showCommand;
  $: stpl = $reqs.options.showTemplate;
  $: sclr = $reqs.options.showClr;
  $: srpc = $reqs.options.showRpc;
  $: logs = $reqs.options.showLog;
</script>

<div class=action>
  <button on:click={clickCollapse}>[-]</button>
  |
  <label for="checkbkClr">
    <input type="checkbox" id="checkbkClr"     on:click={showClr}       bind:checked={sclr}>Clr
  </label>
  |
  <label for="checkbkParsed">
    <input type="checkbox" id="checkbkParsed"  on:click={autoParsed}    bind:checked={prsd}>Parsed
  </label>
  <label for="checkbkHdrs">
    <input type="checkbox" id="checkbkHdrs"    on:click={showHeader}    bind:checked={hdrs}>Header
  </label>
  <label for="checkbkLogs">
    <input type="checkbox" id="checkbkLogs"    on:click={showLog}       bind:checked={logs}>Logs
  </label>
  |
  <label for="checkbkRuns">
    <input type="checkbox" id="checkbkRuns"    on:click={showHidden}    bind:checked={hidn}>Vars
  </label>
  <label for="checkbkTemplate">
    <input type="checkbox" id="checkbkTemplate" on:click={showTemplate} bind:checked={stpl}>Template
  </label>
  |
  <label for="checkbkSrcs">
    <input type="checkbox" id="checkbkSrcs"     on:click={showSource}   bind:checked={ssrc}>Source
  </label>
  <label for="checkbkCommand">
    <input type="checkbox" id="checkbkCommand" on:click={showCommand}   bind:checked={scmd}>Cmd
  </label>
  <label for="checkbkRpc">
    <input type="checkbox" id="checkbkRpc"     on:click={showRpc}       bind:checked={srpc}>Rpc
  </label>
</div>

<style lang="scss">
  [type="checkbox"] {
    vertical-align: sub;
  }
</style>
