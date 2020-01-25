
import React, { useEffect } from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useResource, apiWrapper } from './apiWrapper'
import { classes } from './styles'


const usePlaylistData = (id: string) => {
  const [resource, setter] = useResource<SpotifyApi.PlaylistObjectFull>(null, true)
  
  useEffect(() => {
    apiWrapper(`/api/playlists/${id}/`, setter)
  }, [id, setter])
  
  return resource
}


export const PlaylistEditor = () => {
  const { id } = useParams()
  
  const { data, loading } = usePlaylistData(id)
  
  console.log({data, loading})
  
  return <div>
    { loading
    ? null
    : data.tracks.items.map((item, index) => 
        <SongRow item={item} key={index}/>
      )
    }
  </div>
}


const SongRow = ({ item }: { item: SpotifyApi.PlaylistTrackObject }) => {
  return <div>
    {item.added_by.id}
  </div>
}


