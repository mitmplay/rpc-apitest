import { c as create_ssr_component, v as validate_component, b as subscribe, d as add_attribute } from './index-f58250d6.js';
import { p as page } from './stores-92cb5c60.js';

const css$1 = {
  code: "header.svelte-tav71c.svelte-tav71c{display:flex;justify-content:space-between}nav.svelte-tav71c.svelte-tav71c{display:flex;justify-content:center;--background:rgba(255, 255, 255, 0.7)}ul.svelte-tav71c.svelte-tav71c{position:relative;padding:0;margin:0;height:3em;display:flex;justify-content:center;align-items:center;list-style:none;background:var(--background);background-size:contain}li.svelte-tav71c.svelte-tav71c{position:relative;height:100%}li[aria-current='page'].svelte-tav71c.svelte-tav71c::before{--size:6px;content:'';width:0;height:0;position:absolute;top:0;left:calc(50% - var(--size));border:var(--size) solid transparent;border-top:var(--size) solid var(--color-theme-1)}nav.svelte-tav71c a.svelte-tav71c{display:flex;height:100%;align-items:center;padding:0 0.5rem;color:var(--color-text);font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;transition:color 0.2s linear}a.svelte-tav71c.svelte-tav71c:hover{color:var(--color-theme-1)}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$1);
  $$unsubscribe_page();
  return `<header class="svelte-tav71c"><nav class="svelte-tav71c"><ul class="svelte-tav71c"><li${add_attribute("aria-current", $page.url.pathname === "/" ? "page" : void 0, 0)} class="svelte-tav71c"><a href="/" class="svelte-tav71c">Home</a></li>
			<li${add_attribute("aria-current", $page.url.pathname === "/about" ? "page" : void 0, 0)} class="svelte-tav71c"><a href="/about" class="svelte-tav71c">About</a></li></ul></nav>
</header>`;
});
const css = {
  code: ".app.svelte-8o1gnw{display:flex;flex-direction:column;min-height:100vh}main.svelte-8o1gnw{flex:1;display:flex;flex-direction:column;padding:1rem;width:100%;max-width:64rem;margin:0 auto;box-sizing:border-box}footer.svelte-8o1gnw{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:12px}@media(min-width: 480px){footer.svelte-8o1gnw{padding:12px 0}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app svelte-8o1gnw">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

	<main class="svelte-8o1gnw">${slots.default ? slots.default({}) : ``}</main>

	<footer class="svelte-8o1gnw"><p>footer</p></footer>
</div>`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-aef34751.js.map
