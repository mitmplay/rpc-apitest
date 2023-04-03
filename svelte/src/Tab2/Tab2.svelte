<script lang="ts">
  import CodeMirror from "./CodeMirror.svelte";

  let value = "";
</script>

<svelte:head>
  <title>Show content</title>
  <meta name="description" content="Showing some contents" />
</svelte:head>

<div>
  <CodeMirror />
</div>