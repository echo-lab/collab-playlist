
import React, { CSSProperties } from 'react'
import { useHover } from './useHover'
import { classes, colors } from './styles'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from './IconButton'


const fontSize = '1.8rem'
const rowStyle = ({ songIsHovered }): CSSProperties => ({
  // display: 'contents',
  ...classes.row,
  // justifyContent: 'spaceEvenly',
  // padding: '0 1.4rem',
  height: '5.0rem',
  ...(songIsHovered && { background: colors.translucentWhite(0.1) }),
})
const childMargin = {
  margin: 'auto 2.0rem',
}
const childText: CSSProperties = {
  ...classes.text,
  ...classes.textOverflow(),
  fontSize,
}
const removeButtonStyle = ({ removeButtonIsHovered }): CSSProperties => ({
  ...childMargin,
  width: '2.4rem',
  height: '2.4rem',
  padding: '0.7rem',
  boxSizing: 'content-box',
  ...(removeButtonIsHovered && { background: colors.translucentWhite(0.2) }),
  borderRadius: '0.3rem',
  color: colors.grayscale.white,
})
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

export const SongRow = ({ item }: { item: SpotifyApi.PlaylistTrackObject }) => {
  const { track } = item
  
  const artistNames = track.artists.map(artist => artist.name).join(', ')
  
  const [songIsHovered, songHoverProps] = useHover()
  const [removeButtonIsHovered, removeButtonHoverProps] = useHover()
  
  
  
  return <div style={rowStyle({ songIsHovered })} {...songHoverProps}>
    <div style={titleStyle}>{track.name}</div>
    <div style={artistStyle}>{artistNames}</div>
    <div style={albumStyle}>{track.album.name}</div>
    <div style={addedByStyle}>{item.added_by.id}</div>
    <IconButton
      icon={faMinusCircle}
      style={removeButtonStyle({ removeButtonIsHovered })}
      {...removeButtonHoverProps}
    />
  </div>
}