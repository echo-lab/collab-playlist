
import React, { useContext, useEffect, useRef } from 'react'
import { DraftTrackData } from './modificationReducer'
import { playlistContext } from './playlistContext'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as styles from './playlistTableRowStyles'
import { useHover } from '../useHover'
import { colors, classes } from '../styles'
import { SituatedChat } from './Chat/SituatedChat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PlaylistTrackObject, PostTrackRequest } from '../shared/apiTypes'
import { handleApiError } from '../api'
import { postWrapper } from '../fetchWrapper'
import { useParams } from 'react-router'
import { asType } from '../util'


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
  
  const { setModificationState, loadPlaylist } = useContext(playlistContext)
  const { id: playlistId } = useParams()
  
  
  // on submit the chat form
  const onSubmit = async (message: string) => {
    const response = await postWrapper(
      `/api/playlists/${playlistId}/tracks`,
      asType<PostTrackRequest>({
        message,
        trackId: track.id
      }),
    )
    handleApiError(response)
    
    if (!response.error) {
      // just resets modification state to 'view'
      setModificationState({ userAction: 'view' })
      // reload playlist to get updated tracks/chats
      loadPlaylist()
      // inform caller of success; this clears the textarea
      return true
    }
    return false
  }
  const onCancel = () => setModificationState({ userAction: 'view' })
  
  
  // scroll to view this track on mount
  const rowRef = useRef<HTMLDivElement>()
  useEffect(() => {
    rowRef.current.scrollIntoView()
  }, [])
  
  // button hover style
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
          onClick={onCancel}
          {...buttonHoverProps}
        >
          <FontAwesomeIcon icon={faTimesCircle} style={classes.icon} />
        </button>
      </div>
    </div>
    <SituatedChat
      track={track}
      action={'add'}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  </div>
}

