
import React, { useEffect, CSSProperties } from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useResource, apiWrapper } from './apiWrapper'
import { classes, colors } from './styles'
import { useHover } from './useHover'


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
  
  const playlistEditorStyle: CSSProperties = {
    ...classes.column,
    padding: '2.0rem',
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


const SongRow = ({ item }: { item: SpotifyApi.PlaylistTrackObject }) => {
  const { track } = item
  // track.name
  const artistNames = track.artists.map(artist => artist.name).join(', ')
  
  const [isHovered, hoverContainerProps] = useHover()
  
  const fontSize = '1.8rem'
  
  const rowStyle: CSSProperties = {
    // display: 'contents',
    ...classes.row,
    // justifyContent: 'spaceEvenly',
    padding: '0.4rem 1.4rem',
    ...(isHovered && { background: colors.grayscale.darkGray}),
  }
  const childStyle: CSSProperties = {
    ...classes.text,
    ...classes.textOverflow(),
    fontSize,
    margin: '0 1.4rem',
  }
  const titleStyle: CSSProperties = {
    ...childStyle,
    flex: 2,
  }
  const artistStyle: CSSProperties = {
    ...childStyle,
    flex: 1,
  }
  const albumStyle: CSSProperties = {
    ...childStyle,
    flex: 1,
  }
  const addedByStyle: CSSProperties = {
    ...childStyle,
    flex: 1,
  }
  
  return <div style={rowStyle} {...hoverContainerProps}>
    <div style={titleStyle}>{track.name}</div>
    <div style={artistStyle}>{artistNames}</div>
    <div style={albumStyle}>{track.album.name}</div>
    <div style={addedByStyle}>{item.added_by.id}</div>
  </div>
}


