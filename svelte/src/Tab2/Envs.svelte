<script>
  export let ns
  import {reqs, changeEnv}  from '../stores/reqsStore';
  import Checkbox from '../lib/Checkbox.svelte';

  async function chgEnv(e) {
    const {value:env} = e.target
    await changeEnv(ns, env)
  }
  $: _envs = [$reqs.req[ns]._template_._env];
</script>

<span class="commonlink">
  <div>env:
    {#each $reqs.req[ns]._template_._envs as env}
      <Checkbox click={chgEnv}  
      bind:group={_envs} value={env}>{env}</Checkbox>
    {/each}
  </div>
</span>

<style lang="scss">
.commonlink {
  position: relative;
  div {
    color: darkmagenta;
    position: absolute;
    font-size: smaller;
    width: 400px;
    left: 35px;
    top: -2px;
  }
}
</style>