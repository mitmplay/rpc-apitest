<script>
  export let _ns
  export let _req
  export let json
  import {onMount} from 'svelte';
  import {changeRun} from '../stores/reqsStore';

  async function chgRun(e) {
    e.stopPropagation()
    const {checked, value} = e.target
    const arrV = value.split('~')
    setTimeout(()=>{
      if (checked && arrV.length>1) {
        runs = runs.filter(v=>!v.match(`${arrV[0]}~`))
        runs.push(value)
      }
      changeRun(_req, _ns, json, runs)
    })
  }
  let runs = [];
  onMount(() => {
    runs = json?._run || []
  })
</script>

<span class="commonlink">
  <div class=runlist>
    <slot />
    <ul>
      {#each json._runs as run}
      <li class=run-options>
        <label>
          <input type="checkbox"
           on:click={chgRun} bind:group={runs} value={run}>{run}&nbsp;
        </label>
        <!-- <span class=run-time>&nbsp;~&gt;&nbsp;</span> -->
      </li>
      {/each}
    </ul>  
  </div>
</span>

<style lang="scss">
.commonlink {
  position: relative;
  white-space: nowrap;
  .runlist {
    position: absolute;
    top: -5px;
    left: 0;
    ul {
      display: none;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    &:hover {
      z-index: 1;
      border: solid rgb(73, 9, 9);
      background-color: azure;
      // margin: -2px -7px 0 0;
      ul {
        display: block;
      }
    }
    .run-options {
      display: flex;
      .run-time {
        color: red;
        &:hover {
          background: cyan;
          border: solid 1px red;
        }
      }
    }
    label {
      display: flex;
      font-size: smaller;
      padding-right: 2px;
      &:hover {
        background: yellow;
        border: solid red;
        cursor: pointer;
      }
      input {
        vertical-align: sub;
      }
    }
  }
}
</style>