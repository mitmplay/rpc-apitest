<script>
  export let _ns
  export let _req
  export let json
  import {onMount} from 'svelte';
  import {changeSlc} from '../stores/reqsStore';

  async function chgSlc(e) {
    const {checked, value} = e.target
    const arrV = value.split('~')
    setTimeout(()=>{
      if (checked && arrV.length>1) {
        selection = selection.filter(v=>!v.match(`${arrV[0]}~`))
        selection.push(value)
      }
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
          <input type="checkbox" on:click={chgSlc} bind:group={selection} value={slc} />
          <span>{slc}</span>
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
    z-index: 1;
    position: absolute;
    white-space: nowrap;
    margin: 0;
    top: -2px;
    span.msg {
      position: absolute;
    }
    ul {
      display: none;
      list-style: none;
      padding: 0;
      margin: 0;
      li:hover {
        background: yellow;
        border: solid 1px red;
      }
      label {
        display: flex;
        font-size: smaller;
        span {
          margin-top: 2px;
          padding-right: 2px;
        }
      }
    }
    &:hover {
      z-index: 2;
      border: solid #dbdbdb;
      background-color: #ffffffd6;
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
    left: 20px;
    top: -2px;
    input {
      vertical-align: sub;
    }
  }
}
</style>