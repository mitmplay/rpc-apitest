<script>
  export let ns
  import {reqs, changeEnv}  from '../stores/reqsStore';

  async function chgEnv(e) {
    const {value:env} = e.target
    await changeEnv(ns, {env})
  }
</script>

<span class="commonlink">
  <div>
    {#each $reqs.req[ns]._template_.envs as env}
      <label for="checkbk{ns}{env}">
        <input type=radio id=checkbk{ns}{env} on:click={chgEnv} 
        checked={$reqs.req[ns]._template_.env===env} value={env}>{env}
      </label>
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