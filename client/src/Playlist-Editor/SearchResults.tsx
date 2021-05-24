
import React, { CSSProperties, useContext } from 'react'
import { classes, colors } from '../styles'
import { ScrollArea } from '../ScrollArea'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useHover } from '../useHover'
import { playlistContext } from './playlistContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GetTrackSearchItem, GetTrackSearchResponse } from '../shared/apiTypes'

const itemNotFirstStyle = {
  marginTop: '1.0rem',
}

export const SearchResults = ({
  searchResults,
  style,
}: {
  searchResults: GetTrackSearchResponse,
  style?: CSSProperties,
}) => {
  
  
  return <ScrollArea style={style}>
    {searchResults.map((track, index) => 
      <SearchItem
        track={track}
        key={index}
        style={index !== 0 && itemNotFirstStyle}
      />
    )}
  </ScrollArea>
}




const imageStyle = {
  ...classes.centeredClippedImage,
  height: '6.0rem',
  width: '6.0rem',
}
const textDivStyle = {
  ...classes.column,
  flex: 1,
  justifyContent: 'space-evenly',
  paddingRight: '0.4rem',
  paddingLeft: '0.4rem',
}
const songNameStyle = {
  ...classes.text,
  ...classes.textOverflow({ lines: 2 }),
}
const artistNamesStyle = {
  ...classes.text,
  ...classes.textOverflow({ lines: 2 }),
  fontSize: '1.4rem',
}
const addButtonStyle = {
  ...classes.button,
  width: '2.4rem',
  height: '2.4rem',
  padding: '0.7rem',
  boxSizing: 'content-box',
  margin: 'auto 2.0rem',
  borderRadius: '0.3rem',
  color: colors.grayscale.white,
} as const

const SearchItem = ({
  track,
  style,
}: {
  track: GetTrackSearchItem,
  style: CSSProperties,
}) => {
  
  const { modificationState, setModificationState } = useContext(playlistContext)
  
  const [addButtonIsHovered, addButtonHoverProps, setAddButtonIsHovered] = useHover()
  
  const addButtonOnClick = () => {
    const { id, album, artists, name } = track
    setModificationState({
      userAction: 'add',
      trackData: { id, album, artists, name },
    })
    setAddButtonIsHovered(false) // otherwise, stays hovered if addition is cancelled
  }
  
  const searchItemStyle = {
    ...style,
    ...classes.row,
  }
  const addButtonStyleDynamic = {
    ...addButtonStyle,
    background: colors.translucentWhite(addButtonIsHovered ? 0.3 : 0.15)
  }
  
  return <div style={searchItemStyle}>
    <img src={track.image} alt={`Album: ${track.album}`} style={imageStyle} />
    <div style={textDivStyle}>
      <div style={songNameStyle}>{track.name}</div>
      <div style={artistNamesStyle}>{track.artists}</div>
    </div>
    { modificationState.userAction === 'view' &&
      <button
        style={addButtonStyleDynamic}
        onClick={addButtonOnClick}
        {...addButtonHoverProps}
      >
        <FontAwesomeIcon icon={faPlusCircle} style={classes.icon} />
      </button>
    }
  </div>
}






