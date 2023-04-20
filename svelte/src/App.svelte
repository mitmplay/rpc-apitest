<script>
  import {onMount} from 'svelte';

  import {updateLogs} from './stores/logsStore';
  import {updateReq } from './stores/reqsStore';
  import Tab1 from "./Tab1/Tab1.svelte";
  import Tab2 from "./Tab2/Tab2.svelte";
  import Tab3 from "./Tab3/Tab3.svelte";
  import Tab4 from "./Tab4/Tab4.svelte";
  import Tabs from "./Tabs/Tabs.svelte";

  let ttl = 0
  let rows = []
  // List of tab items with labels, values and assigned components
  let items = [
    { label: "Logs",
     value: 1,
     component: Tab1,
     props: {rows}
    },
    { label: "Request",
     value: 2,
     component: Tab3
    },
    { label: "Script",
     value: 3,
     component: Tab2
    },
    { label: "OpenApi",
     value: 4,
     component: Tab4
    },
  ];

  onMount(() => {
    window.RPC._broadcast_._any_.homepage = async (data, method) => {
      const [name, path] = method.split(':')
      const {broadcast, result} = data
      if (name==='api.peek') {
        updateLogs(result)
        console.log({broadcast})
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
  Apitest <b>v{window.RPC._version_}</b>
</h1>
<div>
  <Tabs {items} />
</div>

<style lang="scss">
  h1 {
    font-size: small;
  }
  b {
    color: red;
  }
</style>