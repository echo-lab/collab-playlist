
import React, { useRef, useState, useLayoutEffect, MutableRefObject } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import './scrollbar.css'


type Rect = ReturnType<Element['getBoundingClientRect']>

/**
 * Gives dimensions of an HTML element
 * 
 * Before initial render, the HTML element doesn't exist yet so ref.current is
 * undefined and there is no meaningful "size"; thus a default rect is used
 * 
 * To the best of my knowledge, does not update when the HTML element's size
 * updates; for this you would need some kind of useExternalState on the
 * element's size (for now we warn the user not to resize window)
 * 
 * Creates its own ref; to use ref with other hooks, either use the returned ref
 * or rewrite hook to use ref given in argument instead of useRef
 */
const useDimensions = (): [MutableRefObject<HTMLDivElement>, Rect] => {
  const defaultRect = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
  } as Rect // missing x, y, and toJSON from DOMRect, but that's because those
  // don't exist in ClientRect
  
  const ref = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState<Rect>(defaultRect)
  
  useLayoutEffect(() => {
    console.log('for dimensions: layout effect and update dimensions')
    setDimensions(ref.current.getBoundingClientRect())
  }, [])

  // useEffect(() => {
  //   setTimeout(() => {
  //     update({})
  //   }, 0)
  // }, [])

  return [ref, dimensions]
}

export const ScrollArea = ({ style, children }) => {
  
  const [ref, { height }] = useDimensions()
  
  // console.log({ height })
  console.log(`for dimensions: render component with height: ${height}`)

  return <div style={style} ref={ref}>
    <SimpleBar style={{ height: height }}>
      {children}
    </SimpleBar>
  </div>
}





