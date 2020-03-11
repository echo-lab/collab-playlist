
import React, { useContext } from 'react'
import { modificationReducerContext } from './modificationReducer'
import { IconButton } from './IconButton'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as styles from './playlistTableRowStyles'
import { useHover } from './useHover'
import { colors } from './styles'


export const DraftAdditionSongRow = ({
  item,
  // addedByUsers,
}: {
  item: SpotifyApi.TrackObjectFull,
  // addedByUsers: Record<string, SpotifyApi.UserObjectPublic>,
}) => {
  // const { track } = item
  
  const artistNames = item.artists.map(artist => artist.name).join(', ')
  
  const { modificationState, dispatch } = useContext(modificationReducerContext)
  
  // const { data: addedByUser, loading: userLoading } = useUserData(item.added_by.id)
  const addedByUser = 'You' //addedByUsers[item.added_by.id]
  
  const cancelButtonOnClick = () => {
    dispatch({
      type: 'cancel',
    })
  }
  
  const [buttonIsHovered, buttonHoverProps] = useHover()
  
  const removeButtonStyle = {
    ...styles.removeButtonStyle,
    background: colors.translucentWhite(buttonIsHovered ? 0.3 : 0.15),
  }
  
  return <tr style={styles.rowStyle}>
    <td style={styles.expandCollapseButtonStyle}></td>
    <td style={styles.titleStyle}>{item.name}</td>
    <td style={styles.artistStyle}>{artistNames}</td>
    <td style={styles.albumStyle}>{item.album.name}</td>
    <td style={styles.addedByStyle}>{addedByUser}</td>
    <td style={styles.removeButtonWrapperStyle}>
      <IconButton
        icon={faTimesCircle}
        style={removeButtonStyle}
        onClick={cancelButtonOnClick}
        {...buttonHoverProps}
      />
    </td>
  </tr>
}

