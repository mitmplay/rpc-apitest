<script>
  export let items = [];
  import {ttp}   from '../stores/ttpStore';
  import {logs, activeTab}  from '../stores/logsStore';
  import Tooltip from '../lib/Tooltip.svelte';

  const handleClick = tabValue => async () => {
    ttp.update(ttpSet => {
      ttpSet.options.isHovered = false
      return ttpSet
    })
    logs.update(json => {
      json.options.activeTab = tabValue
      window.location.hash = activeTab();
      return json
    })
  };
</script>

<ul>
{#each items as item}
  <li class={$logs.options.activeTab === item.value ? 'active' : ''}>
    <span on:click={handleClick(item.value)}>{item.label}</span>
  </li>
{/each}
<li class=slot>
  <slot></slot>
</li>
</ul>

{#each items as item}
  {#if $logs.options.activeTab == item.value}
    <div class="box">
      <svelte:component this={item.component}/>
    </div>
  {/if}
{/each}
<Tooltip />

<style>
  .box {
    margin-bottom: 5px;
    padding: 0;
    border: 1px solid #dee2e6;
    border-radius: 0 0 .5rem .5rem;
    border-top: 0;
  }
  .slot {
    z-index: 2;
    position: fixed;
    right: 18px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
  li {
    margin-bottom: -1px;
    font-size: 0.8em;
    font-weight: 500;
  }

  span {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.15rem 0.7rem;
    cursor: pointer;
  }

  span:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span {
    color: #495057;
    background-color: #d2dbc1;
    border-color: #dee2e6 #dee2e6 #d2dbc1;
  }
</style>