import { writable, get } from 'svelte/store';
import { ttparser } from '../lib/tooltip';

const json = {
  options: {
    isHovered: false,
    title: '',
    _x: 0,
    _y: 0,  
  }
}

export const ttp = writable(json);

function leave(event) {
  // console.log(event)
  ttp.update(ttpSet => {
    ttpSet.options.isHovered = false
    return json
  })
}

export function mouseOver(event) {
  const str = ttparser(event)
  if (str) {
    const {isHovered} = get(ttp)
    if (!isHovered) {
      const {x,y,height} = event.target.getBoundingClientRect()
      ttp.update(ttpSet => {
        ttpSet.options.title = str
        ttpSet.options.isHovered = true
        ttpSet.options._y = y+height 
        ttpSet.options._x = x
        return json
      })
    }
  } else if (!event.target.classList.contains('ttp')) {
    leave(event)
  }
}

export function mouseLeave(event) {
  leave(event)
}
