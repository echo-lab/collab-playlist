
import React from 'react'
import { classes } from './styles'
import { useApi } from './api-hooks'


const usePlaylists = () => {
  return useApi('/api/playlists/', { cache: 'reload' })
}



export const PlaylistTab = () => {
  const result = usePlaylists()
  
  const searchTabStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(20.0rem, 1fr))',
    gridAutoRows: '25.0rem',
    flex: '0.75',
  }
  
  return <div style={searchTabStyle}>
    {result && result.map((playlist, index) => <Playlist key={index} item={playlist} />)}
  </div>
}


const Playlist = ({ item }) => {
  const textStyle = {
    ...classes.text,
    overflow: 'auto',
  }
  return <div>
    <p style={textStyle}>{item.name}</p>
  </div>
}

