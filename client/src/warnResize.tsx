
import { useState, useLayoutEffect, useEffect, useCallback } from 'react'
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
const useUpdateEffect = (func, deps) => {
  const [first, setFirst] = useState(true)
  
  useEffect(() => {
    if (first) {
      setFirst(false)
    } else {
      func()
    }
    // eslint-disable-next-line
  }, [...deps, func])
}

export const useWarnResize = () => {
  const size = useWindowSize()
  
  const warnUser = useDebounceCallback(useCallback(() => {
    alert('Please refresh after resizing window')
  }, []), 1000)
  
  useUpdateEffect(warnUser, [size])
}


