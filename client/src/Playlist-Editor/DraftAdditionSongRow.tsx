
import React, { useContext, useEffect, useRef } from 'react'
import { modificationReducerContext } from './modificationReducer'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as styles from './playlistTableRowStyles'
import { useHover } from '../useHover'
import { colors, classes } from '../styles'
import { SituatedChat } from './SongChat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


/**
 * A row of the playlist table showing a song that does not exist in the
 * playlist yet, but has been selected by the user to be added.
 * Addition can be confirmed or cancelled
 */
export const DraftAdditionSongRow = ({
  item,
  // addedByUsers,
}: {
  item: SpotifyApi.TrackObjectFull,
  // addedByUsers: Record<string, SpotifyApi.UserObjectPublic>,
}) => {
  
  const artistNames = item.artists.map(artist => artist.name).join(', ')
  
  const { modificationState, dispatch } = useContext(modificationReducerContext)
  
  const addedByUser = 'You'
  
  const cancelButtonOnClick = () => {
    dispatch({
      type: 'cancel',
    })
  }
  
  const rowRef = useRef<HTMLTableRowElement>()
  
  useEffect(() => {
    rowRef.current.scrollIntoView()
  }, [])
  
  const [buttonIsHovered, buttonHoverProps] = useHover()
  
  const rightButtonStyleDynamic = {
    ...styles.rightButtonStyle,
    background: colors.translucentWhite(buttonIsHovered ? 0.3 : 0.15),
  }
  
  return <tr style={classes.column} ref={rowRef}>
    <div style={styles.rowStyle}>
      <td style={styles.expandCollapseButtonStyle}></td>
      <td style={styles.titleStyle}>{item.name}</td>
      <td style={styles.artistStyle}>{artistNames}</td>
      <td style={styles.albumStyle}>{item.album.name}</td>
      <td style={styles.addedByStyle}>{addedByUser}</td>
      <td style={styles.rightButtonWrapperStyle}>
        <button
          style={rightButtonStyleDynamic}
          onClick={cancelButtonOnClick}
          {...buttonHoverProps}
        >
          <FontAwesomeIcon icon={faTimesCircle} style={classes.icon} />
        </button>
      </td>
    </div>
    <SituatedChat action={modificationState.userAction} id={item.id} />
  </tr>
}

