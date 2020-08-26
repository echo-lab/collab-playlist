
import React, { useContext, useState } from 'react'
import { modificationReducerContext } from './modificationReducer'
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
  item,
  addedByUsers,
}: {
  item: PlaylistTrackObject,
  addedByUsers: Record<string, SpotifyApi.UserObjectPublic>,
}) => {
  
  const { track } = item
  const artistNames = track.artists.map(artist => artist.name).join(', ')
  
  
  const { modificationState, dispatch } = useContext(modificationReducerContext)
  
  const addedByUser = addedByUsers[item.addedBy]
  
  const removeButtonOnClick = () => {
    dispatch({
      type: 'select-remove',
      payload: { songId: track.id },
    })
    setRemoveButtonIsHovered(false) // otherwise, stays hovered if cancelled
  }
  
  const viewState = modificationState.userAction === "view"
  const removeThisState = modificationState.userAction === "remove"
    && modificationState.songId === track.id
  const [viewThisState, setViewThisState] = useState(false)
  
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
        { !removeThisState &&
          <button
            style={expandButtonStyle}
            onClick={() => setViewThisState(currState => !currState)}
            {...expandButtonHoverProps}
          >
            <FontAwesomeIcon
              icon={ viewThisState
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
        { viewState
        ? <button
            style={rightButtonStyle}
            onClick={removeButtonOnClick}
            {...removeButtonHoverProps}
          >
            <FontAwesomeIcon icon={faMinusCircle} style={classes.icon} />
          </button>
        : <></>
        }
        
      </div>
    </div>
    { (removeThisState || viewThisState) &&
      <SituatedChat action={modificationState.userAction} track={item} />
    }
  </div>
}

