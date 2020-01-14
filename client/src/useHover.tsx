
import { useState, DOMAttributes } from 'react'



export const useHover = (): [boolean, DOMAttributes<HTMLElement>] => {
  
  const [isHovered, setIsHovered] = useState(false)
  
  const containerProps: DOMAttributes<HTMLElement> = {
    onMouseEnter: () => { setIsHovered(true) },
    onMouseLeave: () => { setIsHovered(false) },
  }
  
  return [isHovered, containerProps]
  
}


