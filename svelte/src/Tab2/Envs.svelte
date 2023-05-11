<script>
  export let ns
  import {reqs}  from '../stores/reqsStore';

  function chgEnv(e) {
    setTimeout(()=>{
      reqs.update(json => {
        json.req[ns]._template_.env = e.target.value
        return json
      })
    })
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