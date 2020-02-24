
import React, { CSSProperties, useContext } from 'react'
import { useHover } from './useHover'
import { classes, colors } from './styles'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from './IconButton'
import { tableFlexValues } from './TableHeader'
import { modificationReducerContext } from './modificationReducer'


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
const removeButtonStyle = ({ removeButtonIsHovered, visible }): CSSProperties => ({
  ...childMargin,
  width: tableFlexValues.removeButtonWidth,
  height: tableFlexValues.removeButtonWidth,
  padding: tableFlexValues.removeButtonPadding,
  boxSizing: 'content-box',
  ...(removeButtonIsHovered && { background: colors.translucentWhite(0.2) }),
  borderRadius: '0.3rem',
  color: colors.grayscale.white,
  visibility: visible ? 'visible' : 'hidden',
})
const titleStyle: CSSProperties = {
  ...childText,
  ...childMargin,
  flex: tableFlexValues.title,
}
const artistStyle: CSSProperties = {
  ...childText,
  ...childMargin,
  flex: tableFlexValues.artist,
}
const albumStyle: CSSProperties = {
  ...childText,
  ...childMargin,
  flex: tableFlexValues.album,
}
const addedByStyle: CSSProperties = {
  ...childText,
  ...childMargin,
  flex: tableFlexValues.addedBy,
}

export const SongRow = ({
  item,
  addedByUsers,
}: {
  item: SpotifyApi.PlaylistTrackObject,
  addedByUsers: Record<string, SpotifyApi.UserObjectPublic>,
}) => {
  const { track } = item
  
  const artistNames = track.artists.map(artist => artist.name).join(', ')
  
  const { modificationState, dispatch } = useContext(modificationReducerContext)
  
  const [songIsHovered, songHoverProps] = useHover()
  const [removeButtonIsHovered, removeButtonHoverProps] = useHover()
  
  // const { data: addedByUser, loading: userLoading } = useUserData(item.added_by.id)
  const addedByUser = addedByUsers[item.added_by.id]
  
  const removeButtonOnClick = () => {
    dispatch({
      type: 'select-remove',
      payload: { id: track.id },
    })
  }
  
  
  return <div style={rowStyle({ songIsHovered })} {...songHoverProps}>
    <div style={titleStyle}>{track.name}</div>
    <div style={artistStyle}>{artistNames}</div>
    <div style={albumStyle}>{track.album.name}</div>
    <div style={addedByStyle}>{addedByUser.display_name}</div>
    <IconButton
      icon={faMinusCircle}
      style={removeButtonStyle({
        removeButtonIsHovered,
        visible: modificationState.userAction === 'view',
      })}
      onClick={removeButtonOnClick}
      {...removeButtonHoverProps}
    />
  </div>
}