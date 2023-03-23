const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.6919f736.js","imports":["_app/immutable/entry/start.6919f736.js","_app/immutable/chunks/index.e12a77bd.js","_app/immutable/chunks/singletons.f055a7e8.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.61c63f58.js","imports":["_app/immutable/entry/app.61c63f58.js","_app/immutable/chunks/index.e12a77bd.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-d69fe940.js'),
			() => import('./chunks/1-167bf1a0.js'),
			() => import('./chunks/2-410ea81c.js'),
			() => import('./chunks/3-e60148c7.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
