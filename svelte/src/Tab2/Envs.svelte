<script>
  export let ns
  import {reqs, changeEnv}  from '../stores/reqsStore';
  import Checkbox from '../lib/Checkbox.svelte';

  async function chgEnv(e) {
    const {value:env} = e.target
    await changeEnv(ns, env)
  }
  $: _envs = [$reqs.req[ns]._template_._env];
  function env(obj) {
    return obj && obj.length
  }
</script>

{#if env($reqs.req[ns]._template_._envs)}
<span class="commonlink">
  <div>env:
    {#each $reqs.req[ns]._template_._envs as env}
      <Checkbox click={chgEnv}  
      bind:group={_envs} value={env}>{env}</Checkbox>
    {/each}
  </div>
</span>
{/if}

<style lang="scss">
.commonlink {
  position: relative;
  div {
    width: calc(100vw - 65px);
    color: darkmagenta;
    position: absolute;
    font-size: smaller;
    left: 20px;
    top: -2px;
  }
}
</style>