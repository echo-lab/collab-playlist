
import React, { useMemo } from 'react'
import { classes } from "./styles"


export const SearchResults = ({ data }) => {
  
  const items = data?.body?.tracks?.items
  
  const searchResultsStyle = {
    ...classes.column,
    overflow: 'auto',
    // overflowY: 'auto',
  }
  
  return <div style={searchResultsStyle}>
    {items?.map((item, index) => <SearchItem item={item} key={index} />)}
  </div>
}


const SearchItem = ({ item }) => {
  const { name, artists, album } = item
  const image = album.images[2]
  const { url: imageUrl, width, height } = image
  const artistNames = artists.map(artist => artist.name).join(', ')
  
  const searchItemStyle = {
    ...classes.row,
    padding: '0.5rem',
    // overflowY: 'visible',
    // overflowX: 'hidden',
  }
  const textDivStyle = {
    ...classes.column,
    justifyContent: 'space-evenly',
    // overflowY: 'visible',
    // overflowX: 'hidden',
  }
  const songNameStyle = useMemo(() => ({
    ...classes.text,
    ...classes.textOverflow({ lines: 2 }),
  }), [])
  const artistNamesStyle = useMemo(() => ({
    ...classes.text,
    ...classes.textOverflow({ lines: 2 }),
    fontSize: '1.4rem',
  }), [])
  
  return <div style={searchItemStyle}>
    <img src={imageUrl} width={width} height={height} alt={`Album: ${album.name}`}/>
    <div style={textDivStyle}>
      <div style={songNameStyle}>{name}</div>
      <div style={artistNamesStyle}>{artistNames}</div>
    </div>
  </div>
}






