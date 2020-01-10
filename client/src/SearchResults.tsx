
import React from 'react'
import { classes } from './styles'
import { ScrollArea } from './ScrollArea'
import { Image } from './Image'


export const SearchResults = ({ data }) => {
  
  const items = data?.body?.tracks?.items
  
  // not using useMemo on this even though it's going to a component (meaning
  // it will always cause rerender because of different reference identity)
  // because when this component rerenders it must be because data changed so
  // we want to rerender ScrollArea anyways
  const scrollAreaStyle = {
    flex: 1,
  }
  
  return <ScrollArea style={scrollAreaStyle}>
    {items?.map((item, index) => <SearchItem item={item} key={index} />)}
  </ScrollArea>
}


const SearchItem = ({ item }) => {
  const { name, artists, album } = item
  const image = album.images[2]
  const artistNames = artists.map(artist => artist.name).join(', ')
  
  const searchItemStyle = {
    ...classes.row,
    padding: '0.5rem',
  }
  const imageStyle = {
    height: '6.0rem',
    width: '6.0rem',
  }
  const textDivStyle = {
    ...classes.column,
    flex: 1,
    justifyContent: 'space-evenly',
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
  
  return <div style={searchItemStyle}>
    <Image src={image.url} alt={`Album: ${album.name}`} style={imageStyle} />
    <div style={textDivStyle}>
      <div style={songNameStyle}>{name}</div>
      <div style={artistNamesStyle}>{artistNames}</div>
    </div>
  </div>
}






