
import React, { useEffect } from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useResource, apiWrapper } from './api-hooks'
import { classes } from './styles'


const usePlaylistData = (id: string) => {
  // return useApi(`/api/playlists/${id}/`) as SpotifyApi.PlaylistObjectFull
  const [resource, setters] = useResource<SpotifyApi.PlaylistObjectFull>(null)
  
  useEffect(() => {
    apiWrapper(`/api/playlists/${id}/`, setters)
    console.log('TEST', id, setters)
  }, [id, setters])
  
  return resource
}


export const PlaylistEditor = () => {
  const { id } = useParams()
  
  const [data, , ] = usePlaylistData(id)
  
  console.log({data})
  
  return <div>
    {data && 
      data.tracks.items.map((item) => 
        <p style={classes.text}>{item.track.name}</p>
      )
    }
  </div>
}



