<script>
  import {ttp, mouseLeave} from '../stores/ttpStore';
  import {logs} from '../stores/logsStore';
  function style({options:o}) {
    const max = `max-width: calc(100% - ${80+o._x}px)`
    return `top: ${o._y}px;left: ${o._x}px;${max};`
  }
</script>

{#if $logs.options.tips && $ttp.options.isHovered}
  <div class="ttp tooltip" style={style($ttp)}>
    {@html $ttp.options.title}
  </div>
{/if}

<style lang="scss">
  .tooltip {
    font-size: small;
    font-family: monospace;
    border: 1px solid #ddd;
    box-shadow: 1px 1px 1px #ddd;
    padding: 0 10px 0 10px;
    background: beige;
    border-radius: 4px;
    position: absolute;
    overflow: hidden;
    max-width: calc(100% - 130px);
    z-index: 1;
  }
</style>