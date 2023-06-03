export function enf(req, ns, run) {
  const {_env} = req[ns]._template_

  let _slc= []
  let sec = req[ns]
  run.split('/').slice(1,-1).forEach(k=>{
    sec = sec[k]
    if (sec?._template_?._slc) {
      _slc = sec._template_._slc
    }
  })
  return _env||_slc?.length ? `',.`: `'`
}