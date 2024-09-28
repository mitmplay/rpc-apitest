<script lang="ts">
  import {onMount} from 'svelte';
  import {get} from 'svelte/store';
  import {reqs, init, autoExpand, syncStor} from '../stores/reqsStore';
  import Actions  from './Actions.svelte';
  import Tree from './Tree.svelte';
  let value = "";

  onMount(async () => {
    window.RPC._broadcast_.request.reqs = (data, method) => {
      if (RPC._obj_.argv.debug) {
        console.log('BROADCAST - REQUEST', {data, method})
      }
      const arr = method.split(/[:/]/).slice(1)
      if (arr.length===2 && arr.includes('_template_')) {
        const run = arr.join('/')
        const ns  = arr[0]
        setTimeout(async ()=>{
          if (RPC._obj_.argv.debug) {
            console.log('Update env request UI')
          }
          const sec = get(reqs).req[ns]

          const [xhr, ori, src, logs] = await RPC.api.request(run, {})
          syncStor(sec._template_, run, xhr, ori, src, logs)
          const _envs = Object.keys(ori.env)

          const {_template_} = sec
          _template_._envs = _envs
          if (!_envs.includes(_template_._env)) {
            delete _template_._env
          }
          reqs.update(json => {
            json.req[ns] = sec
            return json
          })
        })
      }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    const requests = await init()
    await autoExpand()
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
  <Tree _req={$reqs.req} json={$reqs.req} _ns={false} _path='Request'/>
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
