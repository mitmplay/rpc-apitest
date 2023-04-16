<script lang="ts">
  import {onMount} from 'svelte';
  import {reqs, init} from '../stores/reqsStore';
  import Actions  from './Actions.svelte';
  import Tree from './Tree.svelte';
  let value = "";

  onMount(async () => {
    const requests = await init()
    console.log('Tab3 onmount!', requests)
  })
</script>

<svelte:head>
  <title>Show Requests</title>
  <meta name="description" content="Showing Requests" />
</svelte:head>

<Actions />
<Tree _req={$reqs.req} json={$reqs.req} />

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
