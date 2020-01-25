
import React, { useEffect } from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useResource, apiWrapper } from './api-hooks'
import { classes } from './styles'


const usePlaylistData = (id: string) => {
  // return useApi(`/api/playlists/${id}/`) as SpotifyApi.PlaylistObjectFull
  const [resource, setter] = useResource<SpotifyApi.PlaylistObjectFull>(null)
  
  useEffect(() => {
    apiWrapper(`/api/playlists/${id}/`, setter)
    console.log('TEST', id, setter)
  }, [id, setter])
  
  return resource
}


export const PlaylistEditor = () => {
  const { id } = useParams()
  
  const { data, loading } = usePlaylistData(id)
  
  console.log({data, loading})
  
  return <div>
    {data && 
      data.tracks.items.map((item) => 
        <p style={classes.text}>{item.track.name}</p>
      )
    }
  </div>
}



