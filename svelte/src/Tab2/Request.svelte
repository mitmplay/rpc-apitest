<script lang="ts">
  import {onMount} from 'svelte';
  import {reqs, init} from '../stores/reqsStore';
  import Actions  from './Actions.svelte';
  import Tree from './Tree.svelte';
  let value = "";

  onMount(async () => {
    const requests = await init()
    if (RPC._obj_.argv.debug) {
      console.log('Request onmount!', requests)
    }
  })
</script>

<svelte:head>
  <title>Show Requests</title>
  <meta name="description" content="Showing Requests" />
</svelte:head>

<Actions />
<section>
  <Tree _req={$reqs.req} json={$reqs.req} />
</section>

<style lang="scss">
  summary{
    white-space: inherit;
  }
  i {
    color:crimson;
  }
  b {
    color:darkblue
  }
</style>
