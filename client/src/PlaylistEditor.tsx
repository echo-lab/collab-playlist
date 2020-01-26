
import React, { useEffect, CSSProperties } from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useResource, apiWrapper } from './apiWrapper'
import { classes, colors } from './styles'
import { useHover } from './useHover'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'


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
  
  const artistNames = track.artists.map(artist => artist.name).join(', ')
  
  const [isHovered, hoverContainerProps] = useHover()
  
  const fontSize = '1.8rem'
  
  const rowStyle: CSSProperties = {
    // display: 'contents',
    ...classes.row,
    // justifyContent: 'spaceEvenly',
    padding: '0.6rem 1.4rem',
    ...(isHovered && { background: colors.grayscale.darkGray}),
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
    width: '3.0rem',
    height: '3.0rem',
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
  
  return <div style={rowStyle} {...hoverContainerProps}>
    { isHovered
    ? <RemoveButton style={removeButtonStyle}/>
    : <div style={removeButtonStyle} />
    }
    <div style={titleStyle}>{track.name}</div>
    <div style={artistStyle}>{artistNames}</div>
    <div style={albumStyle}>{track.album.name}</div>
    <div style={addedByStyle}>{item.added_by.id}</div>
  </div>
}



const RemoveButton = ({ onClick, style }: { onClick?: () => void, style?: CSSProperties }) => {
  const buttonStyle = {
    // these styles only neutralize browser styles:
    background: 'transparent',
    border: 'none',
    padding: 0,
    // you specify the rest of the styles
    ...style,
  }
  const iconStyle = {
    width: '100%',
    height: '100%',
  }
  return <button style={buttonStyle} onClick={onClick}>
    <FontAwesomeIcon icon={faMinusCircle} style={iconStyle} />
  </button>
}


