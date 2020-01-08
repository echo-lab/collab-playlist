
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
  const owner = item.owner?.display_name ?? ''
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
    {/* <Image src={image.url} width={image.width} height={image.height} style={imageStyle} /> */}
    <Image src={image.url} alt="" style={imageStyle} />
    <div style={textDivStyle}>
      <p style={nameStyle}>{item.name}</p>
      <p style={ownerStyle}>{owner}</p>
    </div>
  </div>
}


const Image = ({ src, alt, style }) => {
  const imageStyle: CSSProperties = {
    ...style,
    // backgroundImage: `url("${src}")`,
    // backgroundPosition: 'center',
    // Make the background image cover the area of the <div>, and clip the excess
    // backgroundSize: 'cover',
    objectPosition: 'center',
    objectFit: 'cover',
  }
  return <img src={src} style={imageStyle} alt={alt} />
}

// const Image = ({ src, style }) => {
//   const wrapperStyle = {
//     ...classes.row,
//     alignItems: 'center',
//   }
//   const beforeStyle = {
//     display: 'block',
//     width: '100%',
//     paddingBottom: '100%',
//     // height: 0,
//     boxSizing: 'border-box',
//   } as const
//   const imageStyle = {
//     ...style,
//     backgroundImage: `url("${src}")`,
//     width: '100%',
//     height: '100%',
//     backgroundPosition: 'center',
//     // Make the background image cover the area of the <div>, and clip the excess
//     backgroundSize: 'cover',
//   }
//   return <div style={wrapperStyle}>
//     <div style={beforeStyle} />
//     <div style={imageStyle} />
//   </div>
//   // const containerStyle = {
//   //   ...style,
//   //   // backgroundImage: `url("${src}")`,
//   //   // width,
//   //   // height,
//   //   // backgroundPosition: 'center',
//   //   /* Make the background image cover the area of the <div>, and clip the excess */
//   //   // backgroundSize: 'cover',
//   //   display: 'flex',
//   //   flexFlow: 'row nowrap',
//   //   alignItems: 'center',
//   // }
//   // return <img src={src} style={containerStyle} alt="" />
// }

