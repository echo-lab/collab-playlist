
import React, { CSSProperties, useContext } from 'react'
import { classes, colors } from './styles'
import { ScrollArea } from './ScrollArea'
import { IconButton } from './IconButton'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useHover } from './useHover'
import { modificationReducerContext } from './modificationReducer'


export const SearchResults = ({
  data,
  style,
}: {
  data: SpotifyApi.TrackSearchResponse,
  style?: CSSProperties,
}) => {
  
  const items = data?.tracks?.items
  
  const itemNotFirstStyle = {
    marginTop: '1.0rem',
  }
  
  return <ScrollArea style={style}>
    {items?.map((item, index) => 
      <SearchItem
        item={item}
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
  width: '2.4rem',
  height: '2.4rem',
  padding: '0.7rem',
  boxSizing: 'content-box',
  margin: 'auto 2.0rem',
  // ...(addButtonIsHovered && { background: colors.translucentWhite(0.2) }),
  borderRadius: '0.3rem',
  color: colors.grayscale.white,
} as const

const SearchItem = ({
  item,
  style,
}: {
  item: SpotifyApi.TrackObjectFull,
  style: CSSProperties,
}) => {
  const { name, artists, album } = item
  const image = album.images[2]
  const artistNames = artists.map(artist => artist.name).join(', ')
  
  const { modificationState, dispatch } = useContext(modificationReducerContext)
  
  const [songIsHovered, songHoverProps] = useHover()
  const [addButtonIsHovered, addButtonHoverProps] = useHover()
  
  const addButtonOnClick = () => {
    dispatch({
      type: 'select-add',
      payload: { songObject: item },
    })
  }
  
  const searchItemStyle = {
    ...style,
    ...classes.row,
    background: colors.translucentWhite(songIsHovered ? 0.1 : 0),
  }
  const addButtonStyleWithHover = {
    ...addButtonStyle,
    background: colors.translucentWhite(addButtonIsHovered ? 0.2 : 0)
  }
  
  return <div style={searchItemStyle} {...songHoverProps}>
    <img src={image.url} alt={`Album: ${album.name}`} style={imageStyle} />
    <div style={textDivStyle}>
      <div style={songNameStyle}>{name}</div>
      <div style={artistNamesStyle}>{artistNames}</div>
    </div>
    { modificationState.userAction === 'view' &&
      <IconButton
        icon={faPlusCircle}
        style={addButtonStyleWithHover}
        onClick={addButtonOnClick}
        {...addButtonHoverProps}
      />
    }
  </div>
}






