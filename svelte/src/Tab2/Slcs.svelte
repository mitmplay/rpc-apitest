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
  $: slcs = [json?.slc];
</script>

<span class="commonlink">
  <div>slc:
    {#each json.slcs as slc}
      <Checkbox click={chgSlc}  
      bind:group={slcs} value={slc}>{slc}</Checkbox>
    {/each}
  </div>
</span>

<style lang="scss">
.commonlink {
  position: relative;
  div {
    color: cadetblue;
    position: absolute;
    font-weight: bold;
    font-size: small;
    width: 400px;
    left: 92px;
    top: -4px;
  }
}
</style>