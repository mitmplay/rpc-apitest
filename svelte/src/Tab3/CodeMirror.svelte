<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";

  let value = "";

  function showCode(evn) {
    console.log({value})
  }
</script>
<button on:click={showCode}>Show Code</button>
<CodeMirror bind:value lang={javascript()} />