
import React from 'react'



export const SearchResults = ({ data }) => {
  
  const items = data?.body?.tracks?.items
  
  const searchResultsStyle = {
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
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
    display: 'flex',
  }
  
  return <div style={searchItemStyle}>
    <img src={imageUrl} width={width} height={height} alt={`Album: ${album.name}`}/>
    <span>{name}</span>
    {''}<span>{artistNames}</span>
  </div>
}






