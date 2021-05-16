
import React, { useContext, useEffect, useRef } from 'react'
import { DraftTrackData } from './modificationReducer'
import { playlistContext } from './playlistContext'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as styles from './playlistTableRowStyles'
import { useHover } from '../useHover'
import { colors, classes } from '../styles'
import { SituatedChat } from './Chat/SituatedChat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PlaylistTrackObject } from '../shared/apiTypes'


/**
 * A row of the playlist table showing a song that does not exist in the
 * playlist yet, but has been selected by the user to be added.
 * Addition can be confirmed or cancelled
 */
export const DraftAdditionSongRow = ({
  trackData,
}: {
  trackData: DraftTrackData,
}) => {
  
  const track: PlaylistTrackObject = {
    ...trackData,
    chat: [],
    removed: false,
    addedBy: 'You', // supposed to be an id, idk whether to use user's id
  }
  
  const artistNames = track.artists.map(artist => artist.name).join(', ')
  
  const { modificationState, setModificationState } = useContext(playlistContext)
    
  const cancelButtonOnClick = () => {
    setModificationState({
      userAction: 'view'
    })
  }
  
  const rowRef = useRef<HTMLDivElement>()
  
  useEffect(() => {
    rowRef.current.scrollIntoView()
  }, [])
  
  const [buttonIsHovered, buttonHoverProps] = useHover()
  
  const rightButtonStyleDynamic = {
    ...styles.rightButtonStyle,
    background: colors.translucentWhite(buttonIsHovered ? 0.3 : 0.15),
  }
  
  return <div style={classes.column} ref={rowRef}>
    <div style={styles.rowStyle}>
      <div style={styles.expandCollapseButtonStyle}></div>
      <div style={styles.titleStyle}>{track.name}</div>
      <div style={styles.artistStyle}>{artistNames}</div>
      <div style={styles.albumStyle}>{track.album.name}</div>
      <div style={styles.addedByStyle}>{track.addedBy}</div>
      <div style={styles.rightButtonWrapperStyle}>
        <button
          style={rightButtonStyleDynamic}
          onClick={cancelButtonOnClick}
          {...buttonHoverProps}
        >
          <FontAwesomeIcon icon={faTimesCircle} style={classes.icon} />
        </button>
      </div>
    </div>
    <SituatedChat action={'add'} track={track} />
  </div>
}

