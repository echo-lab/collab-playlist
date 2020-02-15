
import React, { useEffect, CSSProperties } from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useResource, apiWrapper } from './apiWrapper'
import { classes, colors } from './styles'
import { useHover } from './useHover'
import { IconButton } from './IconButton'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'


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


const SongRow = ({ item }: { item: SpotifyApi.PlaylistTrackObject }) => {
  const { track } = item
  
  const artistNames = track.artists.map(artist => artist.name).join(', ')
  
  const [songIsHovered, songHoverProps] = useHover()
  const [removeButtonIsHovered, removeButtonHoverProps] = useHover()
  
  const fontSize = '1.8rem'
  
  const rowStyle: CSSProperties = {
    // display: 'contents',
    ...classes.row,
    // justifyContent: 'spaceEvenly',
    padding: '0 1.4rem',
    height: '5.0rem',
    ...(songIsHovered && { background: colors.translucentWhite(0.1) }),
  }
  const childMargin = {
    margin: 'auto 1.4rem',
  }
  const childText: CSSProperties = {
    ...classes.text,
    ...classes.textOverflow(),
    fontSize,
  }
  const removeButtonStyle: CSSProperties = {
    ...childMargin,
    width: '2.4rem',
    height: '2.4rem',
    padding: '0.7rem',
    boxSizing: 'content-box',
    ...(removeButtonIsHovered && { background: colors.translucentWhite(0.2) }),
    borderRadius: '0.3rem',
    color: colors.grayscale.white,
  }
  const titleStyle: CSSProperties = {
    ...childText,
    ...childMargin,
    flex: 2,
  }
  const artistStyle: CSSProperties = {
    ...childText,
    ...childMargin,
    flex: 1,
  }
  const albumStyle: CSSProperties = {
    ...childText,
    ...childMargin,
    flex: 1,
  }
  const addedByStyle: CSSProperties = {
    ...childText,
    ...childMargin,
    flex: 1,
  }
  
  return <div style={rowStyle} {...songHoverProps}>
    <div style={titleStyle}>{track.name}</div>
    <div style={artistStyle}>{artistNames}</div>
    <div style={albumStyle}>{track.album.name}</div>
    <div style={addedByStyle}>{item.added_by.id}</div>
    <IconButton
      icon={faMinusCircle}
      style={removeButtonStyle}
      {...removeButtonHoverProps}
    />
  </div>
}





