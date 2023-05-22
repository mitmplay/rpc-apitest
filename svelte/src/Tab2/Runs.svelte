<script>
  export let _ns
  export let _req
  export let json
  import {changeRun} from '../stores/reqsStore';
  import Checkbox from '../lib/Checkbox.svelte';

  async function chgRun(e) {
    const {value:_run} = e.target
    changeRun(_req, _ns, json, _run)
  }
  $: _runs = [json?._run];
</script>

<span class="commonlink">.
  <div class=runlist>
    <slot />
    <ul>
      {#each json._runs as run}
      <li>
        <label>
          <input type="checkbox"
           on:click={chgRun} bind:group={_runs} value={run}>{run}
        </label>
      </li>
      {/each}
    </ul>  
  </div>
</span>

<style lang="scss">
.commonlink {
  position: relative;
  .runlist {
    position: absolute;
    top: 0;
    left: 0;
    // margin-left: 300px;
    // margin-top: 4px;
    z-index: 1;
    ul {
      display: none;
      list-style: none;
      padding: 0;
    }
    &:hover {
      border: solid rgb(73, 9, 9);
      background-color: azure;
      // margin: -2px -7px 0 0;
      ul {
        display: block;
      }
    }
  }
}
</style>