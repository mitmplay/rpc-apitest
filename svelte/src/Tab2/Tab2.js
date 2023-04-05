export function clickSummary(evn, lg) {
  const el = evn.target.parentElement
  setTimeout(_ => {
    logs.update(json => {
      const {id,name} = el.dataset
      const open = (typeof el.getAttribute('open')==='string')
      json[lg][id][name]= open
      return json
    });  
  })
}