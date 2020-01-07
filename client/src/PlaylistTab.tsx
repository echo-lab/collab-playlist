
import React from 'react'
// import { classes } from './styles'
import { useApi } from './api-hooks'


const usePlaylists = () => {
  return useApi('/api/playlists/')
}



export const PlaylistTab = () => {
  const result = usePlaylists()
  
  const searchTabStyle = {
    display: 'grid',
    flex: '0.75',
  }
  
  return <div style={searchTabStyle}>
    {result && result.map(playlist => <Playlist item={playlist} />)}
  </div>
}


const Playlist = ({ item }) => {
  return <div>
    <pre>{JSON.stringify(item, null, 2)}</pre>
  </div>
}

