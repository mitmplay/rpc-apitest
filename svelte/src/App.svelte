<script>
  import {onMount} from 'svelte';

  import {
    logs,
    updateLogs
  } from './stores/logsStore';
  import Tab1 from "./Tab1/Tab1.svelte";
  import Tab2 from "./Tab2/Tab2.svelte";
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
    { label: "Content",
     value: 2,
     component: Tab2
    },
  ];

  onMount(() => {
    window.RPC._broadcast_._any_.homepage = async data => {
      const {broadcast, result} = data
      updateLogs(result)
      console.log({broadcast})
      window.logs = result
      ttl++
    }
    setTimeout(async ()=>{await window.RPC.api.peek()}, 500)
  })

</script>
<h1>
  <b>R</b>emote
  <b>P</b>rocedure
  <b>C</b>all
  Apitest
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