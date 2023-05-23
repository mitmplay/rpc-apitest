<script>
  export let _ns
  export let _req
  export let json
  import {onMount} from 'svelte';
  import {changeSlc} from '../stores/reqsStore';

  async function chgSlc(e) {
    setTimeout(()=>{
      changeSlc(_req, _ns, json, selection)
    })
  }
  let selection = [];
  onMount(() => {
    selection = json?._slc || []
  })
</script>

<span class="commonlink">
  <div class=slclist>
    <span>select:</span>
    <span class=msg>&nbsp;{json?._slc||''}</span>
    <ul>
      {#each json._slcs as slc}
      <li>
        <label>
          <input type="checkbox" on:click={chgSlc} bind:group={selection} value={slc} />{slc}
        </label>
      </li>
      {/each}
    </ul>
  </div>
</span>

<style lang="scss">
.commonlink {
  position: relative;
  .slclist {
    position: absolute;
    margin-left: 2px;
    z-index: 1;
    top: -1px;
    span.msg {
      position: absolute;
    }
    ul {
      display: none;
      list-style: none;
      padding: 0;
      margin: 0;
      label {
        display: flex;
      }
    }
    &:hover {
      border: solid #dbdbdb;
      background-color: #f0ffffd6;
      ul {
        display: block;
      }
    }
  }
  div {
    color: blue;
    position: absolute;
    font-size: smaller;
    padding: 0 4px 0 2px;
    left: 92px;
    input {
      vertical-align: sub;
    }
  }
}
</style>