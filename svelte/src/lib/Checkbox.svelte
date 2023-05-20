<script>
  export let click;
  export let group = undefined;
	export let value = undefined;
</script>
<label>
  <input type="checkbox" on:click={click} bind:group value={value}>
	<span class=_hover_><slot /></span>
</label>

<style lang="scss">
  label {
    font-size: smaller;
    [type="checkbox"] {
      vertical-align: sub;
      margin: 0 -2px 0 2px;
      cursor: pointer;
  }
  }
  </style>