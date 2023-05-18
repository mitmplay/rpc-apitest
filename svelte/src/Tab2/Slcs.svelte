<script>
  export let ns
  export let json
  import {reqs, changeSlc}  from '../stores/reqsStore';
  import Checkbox from '../lib/Checkbox.svelte';
  let selection = [];
  async function chgSlc(e) {
    const {value:slc} = e.target
    changeSlc(ns, slc)
  }
</script>

<span class="commonlink">
  <div>
    {#each json.slcs as slc}
      <Checkbox click={chgSlc}  
      bind:group={selection} value={slc}>{slc}</Checkbox>
    {/each}
  </div>
</span>

<style lang="scss">
.commonlink {
  position: relative;
  div {
    position: absolute;
    width: 400px;
    left: 100px;
    top: -4px;
  }
}
</style>