
import React, { useContext, useState } from 'react'
import { useParams } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleDown, faChevronCircleUp, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { handleApiError } from '../api'
import { postWrapper } from '../fetchWrapper'
import { PostSituatedChatRequest, PutTrackRemovedRequest } from '../shared/apiTypes'
import { RemovedTrackObject } from '../shared/dbTypes'
import { classes, colors } from '../styles'
import { useHover } from '../useHover'
import { asType } from '../util'
import { playlistContext } from './playlistContext'
import * as styles from './playlistTableRowStyles'
import { SituatedChat } from './Chat/SituatedChat'


export const RemovedTrackRow = ({ track }: { track: RemovedTrackObject }) => {
  
  const {
    modificationState, setModificationState, loadPlaylist
  } = useContext(playlistContext)
  
  const { id: playlistId } = useParams()
  
  // true if user is attempting to re-add *this* track; else the user is just
  //  viewing or commenting on this track
  const reAddingThis = modificationState.userAction === "re-add"
    && modificationState.trackId === track.id
  
  // situated chat expand/collapse button
  const [chatExpanded, setChatExpanded] = useState(false)
  
  // button hover states
  const [expandButtonIsHovered, expandButtonHoverProps] = useHover()
  const [reAddButtonIsHovered, reAddButtonHoverProps, setReAddButtonIsHovered] = useHover()
  
  
  // on click the right-most "re-add" button
  const reAddButtonOnClick = () => {
    setModificationState({
      userAction: 're-add',
      trackId: track.id,
    })
    setReAddButtonIsHovered(false) // otherwise, stays hovered if cancelled
  }
  
  // on submit the chat form
  const onSubmitChat = async (message: string) => {
    const response = reAddingThis
      ? await postWrapper(
          `/api/playlists/${playlistId}/tracks/${track.id}/removed/`,
          asType<PutTrackRemovedRequest>({
            remove: false,
            message
          }),
          { method: 'PUT' }
        )
      : await postWrapper(
          `/api/playlists/${playlistId}/tracks/${track.id}/chat/`,
          asType<PostSituatedChatRequest>({ message }),
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
  // on cancel the chat form
  const onCancelChat = () => {
    if (reAddingThis) {
      setModificationState({ userAction: 'view' })
    } else {
      setChatExpanded(false)
    }
  }
  
  
  
  const expandButtonStyle = {
    ...styles.rightButtonStyle,
    background: colors.translucentWhite(expandButtonIsHovered ? 0.3 : 0.15),
  }
  const rightButtonStyle = {
    ...styles.rightButtonStyle,
    background: colors.translucentWhite(reAddButtonIsHovered ? 0.3 : 0.15),
  }
  
  return <div style={classes.column}>
    <div style={styles.rowStyle}>
      <div style={styles.rightButtonWrapperStyle}>
        {/* only show expand/collapse button if not currently re-adding this track */}
        { !reAddingThis &&
          <button
            style={expandButtonStyle}
            onClick={() => setChatExpanded(currState => !currState)}
            {...expandButtonHoverProps}
          >
            <FontAwesomeIcon
              icon={ chatExpanded
                ? faChevronCircleUp
                : faChevronCircleDown
              }
              style={classes.icon}
            />
          </button>
        }
      </div>
      <div style={styles.titleStyle}>{track.name}</div>
      <div style={styles.artistStyle}>{track.artists}</div>
      <div style={styles.albumStyle}>{track.album}</div>
      <div style={styles.addedByStyle}>{track.removedBy}</div>
      <div style={styles.rightButtonWrapperStyle}>
        {/* only provide the re-add button as an option if no other track is
            currently selected for modification */}
        { modificationState.userAction === "view" &&
          <button
            style={rightButtonStyle}
            onClick={reAddButtonOnClick}
            {...reAddButtonHoverProps}
          >
            <FontAwesomeIcon icon={faPlusCircle} style={classes.icon} />
          </button>
        }
      </div>
    </div>
    {/* only show chat if this track is selected for re-adding or chat is expanded */}
    { (reAddingThis || chatExpanded) &&
      <SituatedChat
        chat={track.chat}
        // re-add action 'overrides' view; if both are true, re-add is shown
        action={reAddingThis ? 're-add' : 'view'}
        onSubmit={onSubmitChat}
        onCancel={onCancelChat}
      />
    }
  </div>
}

