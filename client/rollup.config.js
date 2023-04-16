const commonjs = require('@rollup/plugin-commonjs')
const {nodeResolve:resolve} = require('@rollup/plugin-node-resolve')

module.exports = {
  input: './client/src/index.js',
  plugins: [
    resolve({
			browser: true,
			dedupe: [],
      preferBuiltins: false
		}),
    commonjs(),
  ],
  output: {
    file: './client/build/client.js',
    sourcemap: 'inline',
    format: 'iife',
    name: 'client'
  },
  watch: {
    chokidar: {
      usePolling: true
    }
  }
}
