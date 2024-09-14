import {clickCollapse} from '../../stores/logsStore';
import {reqs} from '../../stores/reqsStore';
import {get} from 'svelte/store';

function wraplongheaders(json) {
  if (json) {
    const {headers} = json
    for (const id in headers) {
      if (headers[id].length>80) {
        headers[id] = `${headers[id].substr(0,85-id.length)}...`
      }
    }
  }
}

export async function option(run, ns, req) {
  const _env = req[ns]?._template_?._env

  const opt = {} // novar!
  _env && (opt.env = _env)

  const slc = {}
  let sec = req[ns]
  const path = run.split('/').slice(1)
  const file = path.pop()
  path.forEach(k=>{ //# getting slc correct-way
    sec = sec[k]
    if (sec?._template_?._slc) {
      sec._template_._slc.forEach(v=>slc[v]=true)
    }
    const arr = Object.keys(slc)
    arr.length && (opt.slc = arr)
  })
  sec[file]._run && (opt.run = sec[file]._run)

  const is_opt = Object.keys(opt).length
  return {opt, is_opt}
}

export async function run(evn, ns, req, logs) {
  evn.preventDefault()
  evn.stopPropagation()
  let {run} = evn.currentTarget.dataset
  const {opt, is_opt} = await option(run, ns, req)
  let arr
  if (is_opt) {
    arr = await RPC.api.request(run, opt)
  } else {
    arr = await RPC.api.request(run)
  }
  const msg = JSON.stringify(arr[0], null, 2)
  if (msg.match(/\{[\w&]+\}/)) {
    alert(`WARNING: Request having UN-parsed !\n${msg}`)
  } else {
    const match = msg.match(/url": "\/([^"]+)/)
    if (match) {
      alert(`WARNING: Request having Incorrect:\n{ url: "/${match[1]}" }`)
    } else {
      let msg
      if (is_opt) {
        console.log(`await RPC.api.fetch('${run}', ${JSON.stringify(opt)})`)
        msg = await RPC.api.fetch(run, opt)
      } else {
        console.log(`await RPC.api.fetch('${run}')`)
        msg = await RPC.api.fetch(run)
      }
      if (typeof msg==='object' && msg!==null) {
        if (logs.options.limithdr) {
          wraplongheaders(msg.request)
          wraplongheaders(msg.response)
        }
        if (msg?.request?.body) {
          msg.request.body = JSON.parse(msg.request.body)
        }
        if (!get(reqs).options.showHeader) {
          const {request: req, response: res} = msg
          req?.headers && (delete req.headers)
          res?.headers && (delete res.headers)
        }
        console.log(JSON.stringify(msg, null, 2))          
        if (msg.rowid && logs.options.autoShowlog) { //# autoShowlog
          clickCollapse({activeTab:1, rowid: msg.rowid})
        }
      } else {
        console.log(msg)
      }
      RPC._obj_.run = msg   
    }
  } 
}