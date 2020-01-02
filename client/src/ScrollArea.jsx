
import React, { useRef, useState, useLayoutEffect } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'



const useDimensions = () => {
  const ref = useRef()
  const [dimensions, setDimensions] = useState({})
  // const [rendered, update] = useState({})
  useLayoutEffect(() => {
    console.log('resize')
    setDimensions(ref.current.getBoundingClientRect().toJSON())
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

  return <div style={style} ref={ref}>
    <SimpleBar style={{ height: height }}>
      {children}
    </SimpleBar>
  </div>
}





