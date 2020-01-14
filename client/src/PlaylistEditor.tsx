
import React from 'react'
import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'



export const PlaylistEditor = ({}) => {
  const { id } = useParams()
  
  
  return <ScrollArea>
    {[...Array(10)].map((_, i) => <p>{i}</p>)}
  </ScrollArea>
}



