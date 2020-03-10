
import React, { useContext } from 'react'
import { modificationReducerContext } from './modificationReducer'
import { IconButton } from './IconButton'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as styles from './playlistTableRowStyles'


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
  
  // const [songIsHovered, songHoverProps] = useHover()
  
  // const { data: addedByUser, loading: userLoading } = useUserData(item.added_by.id)
  const addedByUser = 'You' //addedByUsers[item.added_by.id]
  
  const cancelButtonOnClick = () => {
    dispatch({
      type: 'cancel',
    })
  }
  
  return <tr style={styles.rowStyle} /*{...songHoverProps}*/>
    <td style={styles.expandCollapseButtonStyle}></td>
    <td style={styles.titleStyle}>{item.name}</td>
    <td style={styles.artistStyle}>{artistNames}</td>
    <td style={styles.albumStyle}>{item.album.name}</td>
    <td style={styles.addedByStyle}>{addedByUser}</td>
    <td style={styles.removeButtonStyle}>
      <IconButton
        icon={faTimesCircle}
        style={styles.removeButtonStyle}
        // style={removeButtonStyle({
        //   hovered: buttonIsHovered,
        //   visible,
        //   // visible: modificationState.userAction === 'view',
        // })}
        onClick={cancelButtonOnClick}
        // {...buttonHoverProps}
      />
    </td>
  </tr>
}

