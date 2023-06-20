import {clickCollapse} from '../../stores/logsStore';

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

export async function run(evn, ns, req, logs) {
  evn.preventDefault()
  let {run} = evn.target.parentElement.dataset
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
    opt.slc = Object.keys(slc)
  })
  opt.run = sec[file]._run

  const arr = await RPC.api.request(run, opt)
  const msg = JSON.stringify(arr[0], null, 2)
  if (msg.match(/\{[\w&]+\}/)) {
    alert(`WARNING: Request having UN-parsed !\n${msg}`)
  } else {
    const match = msg.match(/url": "\/([^"]+)/)
    if (match) {
      alert(`WARNING: Request having Incorrect:\n{ url: "/${match[1]}" }`)
    } else {
      console.log(`await RPC.api.fetch('${run}', ${JSON.stringify(opt)})`)
      let msg = await RPC.api.fetch(run, opt)
      if (typeof msg==='object' && msg!==null) {
        if (logs.options.limithdr) {
          wraplongheaders(msg.request)
          wraplongheaders(msg.response)
        }
        if (msg?.request?.body) {
          msg.request.body = JSON.parse(msg.request.body)
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