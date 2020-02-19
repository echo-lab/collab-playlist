
import React, { useEffect, CSSProperties } from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useResource, apiWrapper } from './apiWrapper'
import { classes, colors } from './styles'
import { SongRow } from './SongRow'


const usePlaylistData = (id: string) => {
  const [resource, setter] = useResource<SpotifyApi.PlaylistObjectFull>(null, true)
  
  useEffect(() => {
    apiWrapper(`/api/playlists/${id}/`, setter)
  }, [id, setter])
  
  return resource
}


export const PlaylistEditor = ({
  style,
}: {
  style?: CSSProperties,
}) => {
  const { id } = useParams()
  
  const { data, loading } = usePlaylistData(id)
  
  console.log({data, loading})
  
  const playlistEditorStyle: CSSProperties = {
    ...style,
    ...classes.column,
    padding: '2.0rem',
    backgroundColor: colors.grayscale.darkGray,
  }
  
  return <div style={playlistEditorStyle}>
    { loading
    ? null
    : data.tracks.items.map((item, index) => 
        <SongRow item={item} key={index}/>
      )
    }
  </div>
}








