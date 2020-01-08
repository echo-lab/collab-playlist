
import React, { CSSProperties } from 'react'
import { classes } from './styles'
import { useApi } from './api-hooks'


const usePlaylists = () => {
  return useApi('/api/playlists/') as SpotifyApi.PlaylistObjectSimplified[]
}



export const PlaylistTab = () => {
  const result = usePlaylists()
  
  const playlistTabStyle: CSSProperties = {
    flex: '0.75',
    padding: '2.0rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(50.0rem, 1fr))',
    gridAutoRows: 'minmax(min-content, max-content)',
    gridGap: '4.0rem',
  }
  
  return <div style={playlistTabStyle}>
    {result && result.map((playlist, index) => <Playlist key={index} item={playlist} />)}
  </div>
}


const Playlist = ({ item }: { item: SpotifyApi.PlaylistObjectSimplified }) => {
  const owner = item.owner?.display_name ?? '' // apparently not always present?
  
  // if multiple images present, image [1] has the closest resolution; else
  // use the only image
  const image = item.images[1] ?? item.images[0]
  
  const playlistStyle = {
    ...classes.row,
  }
  const imageStyle = {
    height: '18.0rem',
    width: '18.0rem',
  }
  const textDivStyle = {
    ...classes.column,
    flex: 1,
  }
  const nameStyle = {
    ...classes.text,
    ...classes.textOverflow(),
  }
  const ownerStyle = {
    ...classes.text,
    ...classes.textOverflow(),
  }
  
  return <div style={playlistStyle}>
    <Image src={image.url} alt="" style={imageStyle} />
    <div style={textDivStyle}>
      <p style={nameStyle}>{item.name}</p>
      <p style={ownerStyle}>{owner}</p>
    </div>
  </div>
}


/**
 * clips image to given size without changing aspect ratio scaling. Only works
 * if image size determines container size. (must give width and height,
 * flexBasis, etc)
 */
const Image = ({ src, alt, style }) => {
  const imageStyle: CSSProperties = {
    ...style,
    objectPosition: 'center',
    // Make the image cover the area of the <img>, and clip the excess
    objectFit: 'cover',
  }
  return <img src={src} style={imageStyle} alt={alt} />
}


