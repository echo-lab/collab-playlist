
import React, { useContext } from 'react'
import { modificationReducerContext } from './modificationReducer'
import { faMinusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as styles from './playlistTableRowStyles'
import { useHover } from '../useHover'
import { colors, classes } from '../styles'
import { SituatedChat } from './SongChat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



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
  
  const addedByUser = addedByUsers[item.added_by.id]
  
  const removeButtonOnClick = () => {
    dispatch({
      type: 'select-remove',
      payload: { songId: track.id },
    })
  }
  const cancelButtonOnClick = () => {
    dispatch({
      type: 'cancel',
    })
  }
  
  const viewState = modificationState.userAction === "view"
  const removeThisState = modificationState.userAction === "remove"
    && modificationState.songId === track.id
  
  const [buttonIsHovered, buttonHoverProps] = useHover()
  
  const rightButtonStyle = {
    ...styles.rightButtonStyle,
    background: colors.translucentWhite(buttonIsHovered ? 0.3 : 0.15),
  }
  
  
  return <tr style={classes.column}>
    <div style={styles.rowStyle}>
      <td style={styles.expandCollapseButtonStyle}>
        {/* TODO */}
      </td>
      <td style={styles.titleStyle}>{track.name}</td>
      <td style={styles.artistStyle}>{artistNames}</td>
      <td style={styles.albumStyle}>{track.album.name}</td>
      <td style={styles.addedByStyle}>{addedByUser.display_name}</td>
      <td style={styles.rightButtonWrapperStyle}>
        { viewState
        ? <button
            style={rightButtonStyle}
            onClick={removeButtonOnClick}
            {...buttonHoverProps}
          >
            <FontAwesomeIcon icon={faMinusCircle} style={classes.icon} />
          </button>
        : removeThisState
        ? <button
            style={rightButtonStyle}
            onClick={cancelButtonOnClick}
            {...buttonHoverProps}
          >
            <FontAwesomeIcon icon={faTimesCircle} style={classes.icon} />
          </button>
        : <></>
        }
        
      </td>
    </div>
    { removeThisState &&
      <SituatedChat action={modificationState.userAction} id={track.id} />
    }
  </tr>
}

