<script>
  import {onMount} from 'svelte';

  import {updateLogs} from './stores/logsStore';
  import {updateReq } from './stores/reqsStore';

  import Tabs    from "./Tabs/Tabs.svelte";
  import Logs    from "./Tab1/Logs.svelte";
  import Docs    from "./Tab5/Docs.svelte";
  import Request from "./Tab2/Request.svelte";
  import Script  from "./Tab3/Script.svelte";
  import OpenApi from "./Tab4/OpenApi.svelte";
  import ShowLog from './ShowLog.svelte';

  let ttl = 0
  let rows = []
  $: version = '' 
  // List of tab items with labels, values and assigned components
  let items = [
    { label: "Logs"   , value: 1, component: Logs, props: {rows}},
    { label: "Request", value: 2, component: Request            },
    { label: "Script" , value: 3, component: Script             },
    { label: "OpenApi", value: 4, component: OpenApi            },
    { label: "Docs"   , value: 5, component: Docs               },
  ];

  onMount(() => {
    window.RPC._broadcast_._any_.homepage = async (data, method) => {
      version = `v${window.RPC._version_}`
      const [name, path] = method.split(':')
      const {broadcast, result} = data
      if (name==='api.peek') {
        updateLogs(result)
        if (RPC._obj_.argv.debug) {
          console.log({broadcast})
        }
        window.logs = result
        ttl++
      } else if (name==='request') {
        updateReq(path, result)
      }
      // return false
    }
    setTimeout(async ()=>{await window.RPC.api.peek()}, 500)
  })

</script>
<h1>
  <b>R</b>emote
  <b>P</b>rocedure
  <b>C</b>all
  Apitest <b>{version}</b>
</h1>
<div>
  <Tabs {items}>
    <ShowLog />
  </Tabs>
</div>

<style lang="scss">
  h1 {
    font-size: small;
  }
  b {
    color: red;
  }
</style>