import './base.css'
import './app.scss'
import './markdown.scss'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})
window.stores = {}
export default app
