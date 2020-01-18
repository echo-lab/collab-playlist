
import React from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useApi } from './api-hooks'
import { classes } from './styles'


const usePlaylistData = (id) => {
  return useApi(`/api/playlists/${id}/`) as SpotifyApi.PlaylistObjectFull
}


export const PlaylistEditor = () => {
  const { id } = useParams()
  
  const data = usePlaylistData(id)
  
  console.log({data})
  
  return <div>
    {data && 
      data.tracks.items.map((item) => 
        <p style={classes.text}>{item.track.name}</p>
      )
    }
  </div>
}



