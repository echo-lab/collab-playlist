
import React, { useContext, useEffect, useRef } from 'react'
import { modificationReducerContext } from './modificationReducer'
import { IconButton } from './IconButton'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as styles from './playlistTableRowStyles'
import { useHover } from './useHover'
import { colors } from './styles'


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
  
  const rightButtonStyle = {
    ...styles.rightButtonStyle,
    background: colors.translucentWhite(buttonIsHovered ? 0.3 : 0.15),
  }
  
  return <tr style={styles.rowStyle} ref={rowRef}>
    <td style={styles.expandCollapseButtonStyle}></td>
    <td style={styles.titleStyle}>{item.name}</td>
    <td style={styles.artistStyle}>{artistNames}</td>
    <td style={styles.albumStyle}>{item.album.name}</td>
    <td style={styles.addedByStyle}>{addedByUser}</td>
    <td style={styles.rightButtonWrapperStyle}>
      <IconButton
        icon={faTimesCircle}
        style={rightButtonStyle}
        onClick={cancelButtonOnClick}
        {...buttonHoverProps}
      />
    </td>
  </tr>
}

