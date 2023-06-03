import {clickCollapse} from '../../stores/logsStore';

export async function run(evn, ns, req, logs) {
  evn.preventDefault()
  const {run, _run} = evn.target.parentElement.dataset
  const _env = req[ns]?._template_?._env

  const opt = {}
  _env && (opt.env = _env)
  _run && (opt.run = _run)

  const slc = {}
  let sec = req[ns]
  run.split('/').slice(1,-1).forEach(k=>{ //# getting slc correct-way
    sec = sec[k]
    if (sec?._template_?._slc) {
      sec._template_._slc.forEach(v=>slc[v]=true)
    }
    opt.slc = Object.keys(slc)
  })

  const arr = await RPC.api.request(run, opt)
  const msg = JSON.stringify(arr[0], null, 2)
  if (msg.match(/\{[\w&]+\}/)) {
    alert(`WARNING: Request having UN-parsed !\n${msg}`)
  } else {
    console.log(`await RPC.api.fetch('${run}', ${JSON.stringify(opt)})`)
    let msg = await RPC.api.fetch(run, opt)
    if (typeof msg==='object' && msg!==null) {
      if (logs.options.limithdr) {
        const {request, response} = msg
        if (request) {
          const {headers: rq_hdr} = request
          for (const id1 in rq_hdr) {
            if (rq_hdr[id1].length>80) {
              rq_hdr[id1] = `${rq_hdr[id1].substr(0,85-id1.length)}...`
            }
          }
        }
        if (response) {
          const {headers: rs_hdr} = response
          for (const id2 in rs_hdr) {
            if (rs_hdr[id2].length>80) {
              rs_hdr[id2] = `${rs_hdr[id2].substr(0,85-id2.length)}...`
            }
          }
        }
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