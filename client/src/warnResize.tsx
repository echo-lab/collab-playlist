
import { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { useDebounceCallback } from '@react-hook/debounce'




const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight])
  
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight])
      console.log(window.innerHeight, window.innerWidth)
    }
    window.addEventListener('resize', updateSize)
    // updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  
  return size
}

/**
 * like useEffect but doesn't run the first time, i.e. only runs when deps
 * change from their first render value
 */
const useUpdateEffect = (func: () => void, deps: any[]) => {
  const firstRef = useRef(true)
  
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false
    } else {
      func()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, func])
}

export const useWarnResize = () => {
  const size = useWindowSize()
  
  // TODO does useDebounceCallback work the way I think it does?
  // dependencies list?
  // TODO might just watch for resize (throttled) and rerender instead of this in the future
  const warnUser = useDebounceCallback(() => {
    alert('Please refresh after resizing window')
  }, 1000)
  
  useUpdateEffect(warnUser, [size])
}


