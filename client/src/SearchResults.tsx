
import React, { CSSProperties } from 'react'
import { classes, colors } from './styles'
import { ScrollArea } from './ScrollArea'
import { Image } from './Image'
import { IconButton } from './IconButton'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useHover } from './useHover'


export const SearchResults = ({
  data,
  style,
}: {
  data: SpotifyApi.TrackSearchResponse,
  style?: CSSProperties,
}) => {
  
  const items = data?.tracks?.items
  
  return <ScrollArea style={style}>
    {items?.map((item, index) => <SearchItem item={item} key={index} />)}
  </ScrollArea>
}


const SearchItem = ({ item }: { item: SpotifyApi.TrackObjectFull }) => {
  const { name, artists, album } = item
  const image = album.images[2]
  const artistNames = artists.map(artist => artist.name).join(', ')
  
  const [songIsHovered, songHoverProps] = useHover()
  const [addButtonIsHovered, addButtonHoverProps] = useHover()
  
  const searchItemStyle = {
    ...classes.row,
    padding: '0.5rem',
    ...(songIsHovered && { background: colors.translucentWhite(0.1) }),
  }
  const imageStyle = {
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
  const addButtonStyle: CSSProperties = {
    width: '2.4rem',
    height: '2.4rem',
    padding: '0.7rem',
    boxSizing: 'content-box',
    margin: 'auto 1.4rem',
    ...(addButtonIsHovered && { background: colors.translucentWhite(0.2) }),
    borderRadius: '0.3rem',
    color: colors.grayscale.white,
  }
  
  return <div style={searchItemStyle} {...songHoverProps}>
    <Image src={image.url} alt={`Album: ${album.name}`} style={imageStyle} />
    <div style={textDivStyle}>
      <div style={songNameStyle}>{name}</div>
      <div style={artistNamesStyle}>{artistNames}</div>
    </div>
    <IconButton
      icon={faPlusCircle}
      style={addButtonStyle}
      {...addButtonHoverProps}
    />
  </div>
}






