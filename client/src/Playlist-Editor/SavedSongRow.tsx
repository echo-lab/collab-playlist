
import React, { useContext, useState } from 'react'
import { playlistContext } from './playlistContext'
import { faMinusCircle, faChevronCircleUp, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons'
import * as styles from './playlistTableRowStyles'
import { useHover } from '../useHover'
import { colors, classes } from '../styles'
import { SituatedChat } from './Chat/SituatedChat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PlaylistTrackObject } from '../shared/apiTypes'



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
  
  
  const { modificationState, setModificationState } = useContext(playlistContext)
  
  const addedByUser = addedByUsers[track.addedBy]
  
  const removeButtonOnClick = () => {
    setModificationState({
      userAction: 'remove',
      trackId: track.id,
    })
    setRemoveButtonIsHovered(false) // otherwise, stays hovered if cancelled
  }
  
  // true if user is attempting to remove *this* track:
  const removingThis = modificationState.userAction === "remove"
    && modificationState.trackId === track.id
  
  const [chatExpanded, setChatExpanded] = useState(false)
  
  const [expandButtonIsHovered, expandButtonHoverProps] = useHover()
  const [removeButtonIsHovered, removeButtonHoverProps, setRemoveButtonIsHovered] = useHover()
  
  
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
      // remove action 'overrides' view; if both are true, removal is shown
      <SituatedChat action={removingThis ? 'remove' : 'view'} track={track} />
    }
  </div>
}

