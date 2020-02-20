
import React, { useEffect, CSSProperties } from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useResource, apiWrapper } from './apiWrapper'
import { classes, colors } from './styles'
import { SongRow } from './SongRow'
import { TableHeader } from './TableHeader'
import { PlaylistInfo } from './PlaylistInfo'


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
    // padding: '2.0rem',
    backgroundColor: colors.grayscale.darkGray,
  }
  const songsStyle = {
    padding: '0 2.0rem 2.0rem',
  }
  
  return <div style={playlistEditorStyle}>
    { loading
    ? null
    : <>
        <PlaylistInfo playlist={data} />
        <TableHeader />
        <div style={songsStyle}>
          {data.tracks.items.map((item, index) => 
            <SongRow item={item} key={index}/>
          )}
        </div>
      </>
    }
  </div>
}








