import { c as create_ssr_component, f as each, e as escape } from './index-f58250d6.js';

const css = {
  code: "summary.svelte-12zrpqi.svelte-12zrpqi{cursor:pointer;font-size:12px;font-weight:bold;font-family:monospace;white-space:pre}summary.svelte-12zrpqi.svelte-12zrpqi:hover{background-color:yellow}pre.svelte-12zrpqi.svelte-12zrpqi{font-size:11px;margin-top:0;margin-bottom:6px}.title.svelte-12zrpqi>b.svelte-12zrpqi{color:blue;font-size:12px;font-weight:bold;font-family:monospace}.main-content.svelte-12zrpqi.svelte-12zrpqi{padding-left:15px}.sub-content.svelte-12zrpqi.svelte-12zrpqi{padding-left:10px}.resp-content.svelte-12zrpqi.svelte-12zrpqi{margin-left:10px;background-color:antiquewhite}.resp-content.svelte-12zrpqi pre.svelte-12zrpqi{margin:0}",
  map: null
};
function no1({ id }, ln = 3) {
  id = "" + id;
  return id.padStart(ln, " ");
}
function date({ created, elapsed }, ln = 3) {
  const dt = new Date(created).toISOString().replace(/\..+/, "");
  const str = "" + Number(elapsed / 1e3).toFixed(2).padStart(ln, " ");
  return `${dt.replace(/.{5}/, "").replace("T", "|")}|${str}`;
}
function resp({ resp_hdr }) {
  if (resp_hdr) {
    const json = JSON.parse(resp_hdr);
    const arr = ["report-to", "nel"];
    arr.forEach((el) => {
      const data = json[el];
      if (data) {
        json[el] = JSON.parse(data);
      }
    });
    return JSON.stringify(json, null, 2);
  }
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rows = [];
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-8gb88t_START -->${$$result.title = `<title>Home</title>`, ""}<meta name="description" content="Svelte demo app"><!-- HEAD_svelte-8gb88t_END -->`, ""}

<section>API(s):
  ${each(rows, (row) => {
    return `<details><summary class="svelte-12zrpqi">${escape(no1(row))}.[${escape(date(row))}]${escape(row.api)}~&gt;(${escape(row.rspcode)})</summary>
      <div class="main-content svelte-12zrpqi"><details><summary class="svelte-12zrpqi">Response headers</summary>
          <div class="resp-content svelte-12zrpqi"><pre class="svelte-12zrpqi">${escape(row.x_tag)}</pre>
            <pre class="svelte-12zrpqi">${escape(resp(row))}</pre>  
          </div></details>
        <div class="sub-content svelte-12zrpqi"><div class="title svelte-12zrpqi"><b class="svelte-12zrpqi">Response Body:</b></div>
          <pre class="svelte-12zrpqi">${escape(row.response)}</pre>
          <div class="title svelte-12zrpqi"><b class="svelte-12zrpqi">Request:</b></div>
          <pre class="svelte-12zrpqi">${escape(row.request)}</pre>  
        </div></div>
  </details>`;
  })}
</section>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-e216d857.js.map
