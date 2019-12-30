
import React from 'react'
import { classes } from "./styles"


export const SearchResults = ({ data }) => {
  
  const items = data?.body?.tracks?.items
  
  const searchResultsStyle = {
    // ...classes.column,
    overflow: 'auto',
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
  }
  
  return <div style={searchItemStyle}>
    <img src={imageUrl} width={width} height={height} alt={`Album: ${album.name}`}/>
    <span style={classes.text}>{name}</span>
    <span style={classes.text}>{artistNames}</span>
  </div>
}






