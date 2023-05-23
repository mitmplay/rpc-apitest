<script>
  export let _ns
  export let _req
  export let json
  import {changeSlc} from '../stores/reqsStore';
  import Checkbox from '../lib/Checkbox.svelte';

  async function chgSlc(e) {
    const {value:slc} = e.target
    changeSlc(_req, _ns, json, slc)
  }
  $: _slcs = [json?._slc];
</script>

<span class="commonlink">
  <div>slc:
    {#each json._slcs as slc}
      <Checkbox click={chgSlc}  
      bind:group={_slcs} value={slc}>{slc}</Checkbox>
    {/each}
  </div>
</span>

<style lang="scss">
.commonlink {
  position: relative;
  div {
    color: blue;
    position: absolute;
    font-size: smaller;
    width: 400px;
    left: 92px;
    top: -4px;
  }
}
</style>