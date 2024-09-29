<script>
  export let klas='';
  export let id=null;
  export let fn=null;
  export let name='';
  export let show=true
  export let open=false;
  export let nspace=null;
</script>

{#if show}
  <details class={klas} data-id={id} data-fn={fn} data-nspace={nspace} data-name={name} {open}>
    <slot name="head">
    </slot>
    {#if open}
      <slot name="body">
      </slot>    
    {/if}
  </details>  
{/if}

<style lang="scss">

</style>