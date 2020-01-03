
import React, { useRef, useState, useLayoutEffect, MutableRefObject } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import './scrollbar.css'


type Rect = ReturnType<Element['getBoundingClientRect']>

const useDimensions = ():[MutableRefObject<HTMLDivElement>, null | Rect, boolean] => {
  const ref = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState<null | Rect>(null)
  const [rendered, setRendered] = useState(false)
  
  useLayoutEffect(() => {
    // console.log('resize')
    setDimensions(ref.current.getBoundingClientRect())
    setRendered(true)
  }, [])

  // useEffect(() => {
  //   setTimeout(() => {
  //     update({})
  //   }, 0)
  // }, [])

  return [ref, dimensions, rendered]
}

export const ScrollArea = ({ style, children }) => {
  
  const [ref, dimensions, rendered] = useDimensions()
  
  const { height } = rendered ? (dimensions as Rect) : { height: 0 }
  
  // console.log({ height })

  return <div style={style} ref={ref}>
    <SimpleBar style={{ height: height }}>
      {children}
    </SimpleBar>
  </div>
}





