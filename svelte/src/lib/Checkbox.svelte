<script>
  export let click;
  export let group = undefined;
	export let value = undefined;
</script>
<label>
  <input type="checkbox" on:click={click} bind:group value={value}>
	<slot />
</label>

<style lang="scss">
  [type="checkbox"] {
    vertical-align: sub;
    margin: 0 -2px 0 2px;
  }
  </style>