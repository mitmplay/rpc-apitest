<script>
  import {ttp, mouseLeave} from '../stores/ttpStore';
  function style({options:o}) {
    return `top: ${o._y}px;left: ${o._x}px;`
  }
</script>

{#if $ttp.options.isHovered}
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
    max-width: 800px;
    z-index: 1;
  }
</style>