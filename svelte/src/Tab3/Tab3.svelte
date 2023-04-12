<script lang="ts">
  import {onMount} from 'svelte';
  import {reqs, init} from '../stores/reqsStore';
  import Actions  from './Actions.svelte';
  import Tree from './Tree.svelte';
  let value = "";

  onMount(async () => {
    const requests = await init()
    console.log('Tab2 onmount!', requests)
  })

  async function run(evn) {
    const {nspace,name} = evn.target.dataset
    console.log(`await req.${nspace}.${name}()`)
    const msg = await RPC.api.fetch(name)
    if (typeof msg==='object' && msg!==null) {
      console.log(JSON.stringify(msg, null, 2))
    } else {
      console.log(msg)
    }
    RPC._obj_.run = msg    
  }
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
