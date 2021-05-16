
import React, { useContext, useState } from 'react'
import { playlistContext } from './playlistContext'
import { faMinusCircle, faChevronCircleUp, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons'
import * as styles from './playlistTableRowStyles'
import { useHover } from '../useHover'
import { colors, classes } from '../styles'
import { SituatedChat } from './Chat/SituatedChat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PlaylistTrackObject, PostSituatedChatRequest, PutTrackRemovedRequest } from '../shared/apiTypes'
import { useParams } from 'react-router'
import { postWrapper } from '../fetchWrapper'
import { handleApiError } from '../api'




/**
 * A row of the playlist table showing a song that currently exists in the
 * playlist. Can be selected to be removed, and removal can then be cancelled
 */
export const SavedSongRow = ({
  track,
  addedByUsers,
}: {
  track: PlaylistTrackObject,
  addedByUsers: Record<string, SpotifyApi.UserObjectPublic>,
}) => {
  
  const artistNames = track.artists.map(artist => artist.name).join(', ')
  const addedByUser = addedByUsers[track.addedBy]
  
  const {
    modificationState, setModificationState, loadPlaylist
  } = useContext(playlistContext)
  
  const { id: playlistId } = useParams()
  
  // true if user is attempting to remove *this* track; else the user is just
  //  viewing or commenting on this track
  const removingThis = modificationState.userAction === "remove"
    && modificationState.trackId === track.id
  
  // situated chat expand/collapse button
  const [chatExpanded, setChatExpanded] = useState(false)
  
  // button hover states
  const [expandButtonIsHovered, expandButtonHoverProps] = useHover()
  const [removeButtonIsHovered, removeButtonHoverProps, setRemoveButtonIsHovered] = useHover()
  
  
  // on click the right-most "remove" button
  const removeButtonOnClick = () => {
    setModificationState({
      userAction: 'remove',
      trackId: track.id,
    })
    setRemoveButtonIsHovered(false) // otherwise, stays hovered if cancelled
  }
  
  // on submit the chat form
  const onSubmitChat = async (message: string) => {
    const response = removingThis
      ? await postWrapper(
          `/api/playlists/${playlistId}/tracks/${track.id}/removed/`,
          { message } as PutTrackRemovedRequest,
          { method: 'PUT' }
        )
      : await postWrapper(
          `/api/playlists/${playlistId}/tracks/${track.id}/chat/`,
          { message } as PostSituatedChatRequest,
        )
    handleApiError(response)
    
    if (!response.error) {
      // just resets modification state to 'view'
      setModificationState({ userAction: 'view' })
      // reload playlist to get updated tracks/chats
      loadPlaylist()
      // // clear message in form
      // setMessage('')
    }
  }
  // on cancel the chat form
  const onCancelChat = () => {
    if (removingThis) {
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
    background: colors.translucentWhite(removeButtonIsHovered ? 0.3 : 0.15),
  }
  
  
  return <div style={classes.column}>
    <div style={styles.rowStyle}>
      <div style={styles.rightButtonWrapperStyle}>
        {/* only show expand/collapse button if not currently removing this track */}
        { !removingThis &&
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
      <div style={styles.artistStyle}>{artistNames}</div>
      <div style={styles.albumStyle}>{track.album.name}</div>
      <div style={styles.addedByStyle}>{addedByUser.display_name}</div>
      <div style={styles.rightButtonWrapperStyle}>
        {/* only provide the remove button as an option if no other track is
            currently selected for removal/addition */}
        { modificationState.userAction === "view" &&
          <button
            style={rightButtonStyle}
            onClick={removeButtonOnClick}
            {...removeButtonHoverProps}
          >
            <FontAwesomeIcon icon={faMinusCircle} style={classes.icon} />
          </button>
        }
      </div>
    </div>
    {/* only show chat if this track is selected for removal or chat is expanded */}
    { (removingThis || chatExpanded) &&
      <SituatedChat
        track={track}
        // remove action 'overrides' view; if both are true, removal is shown
        action={removingThis ? 'remove' : 'view'}
        onSubmit={onSubmitChat}
        onCancel={onCancelChat}
      />
    }
  </div>
}

