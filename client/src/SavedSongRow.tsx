
import React, { useContext } from 'react'
import { modificationReducerContext } from './modificationReducer'
import { IconButton } from './IconButton'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import * as styles from './playlistTableRowStyles'



/**
 * A row of the playlist table showing a song that currently exists in the
 * playlist. Can be selected to be removed, and removal can then be cancelled
 */
export const SavedSongRow = ({
  item,
  addedByUsers,
}: {
  item: SpotifyApi.PlaylistTrackObject,
  addedByUsers: Record<string, SpotifyApi.UserObjectPublic>,
}) => {
  
  const { track } = item
  const artistNames = track.artists.map(artist => artist.name).join(', ')
  
  
  const { modificationState, dispatch } = useContext(modificationReducerContext)
  
  // const { data: addedByUser, loading: userLoading } = useUserData(item.added_by.id)
  const addedByUser = addedByUsers[item.added_by.id]
  
  const removeButtonOnClick = () => {
    dispatch({
      type: 'select-remove',
      payload: { songId: track.id },
    })
  }
  
  
  // const [songIsHovered, songHoverProps] = useHover()
  // const [removeButtonIsHovered, removeButtonHoverProps] = useHover()
  
  
  return <tr style={styles.rowStyle} /*{...songHoverProps}*/>
    <td style={styles.expandCollapseButtonStyle}></td>
    <td style={styles.titleStyle}>{track.name}</td>
    <td style={styles.artistStyle}>{artistNames}</td>
    <td style={styles.albumStyle}>{track.album.name}</td>
    <td style={styles.addedByStyle}>{addedByUser.display_name}</td>
    <IconButton
      icon={faMinusCircle}
      // style={removeButtonStyle({
      //   hovered: removeButtonIsHovered,
      // })}
      // visible={modificationState.userAction === 'view'}
      onClick={removeButtonOnClick}
      // {...removeButtonHoverProps}
    />
  </tr>
}

