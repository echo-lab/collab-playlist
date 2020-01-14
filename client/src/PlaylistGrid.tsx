
import React, { CSSProperties } from 'react'
import { classes, colors } from './styles'
import { usePlaylists } from './api-hooks'
import { Image } from './Image'
import { useHover } from './useHover'
import { Link } from 'react-router-dom'




export const PlaylistGrid = () => {
  const result = usePlaylists()
  
  const playlistGridStyle: CSSProperties = {
    padding: '2.0rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(50.0rem, 1fr))',
    gridAutoRows: 'minmax(min-content, max-content)',
  }
  
  return <div style={playlistGridStyle}>
    {result && result.map((playlist, index) => <PlaylistCard key={index} item={playlist} />)}
  </div>
}


const PlaylistCard = ({ item }: { item: SpotifyApi.PlaylistObjectSimplified }) => {
  const owner = item.owner?.display_name ?? '' // apparently not always present?
  
  // if multiple images present, image [1] has the closest resolution; else
  // use the only image
  const image = item.images[1] ?? item.images[0]
  
  const [isHovered, hoverContainerProps] = useHover()
  
  const playlistCardStyle = {
    ...classes.row,
    ...(isHovered && { backgroundColor: colors.grayscale.darkGray }),
    padding: '2.0rem',
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
  
  // TODO The Link causes the search tab to be rerendered and thus lose its
  // state (query); add state to Link? will changing structure of
  // Routers/Switches make that not happen?
  return <Link
    to={`/playlist/${item.id}`}
    style={playlistCardStyle}
    {...hoverContainerProps}
  >
    <Image src={image.url} alt="" style={imageStyle} />
    <div style={textDivStyle}>
      <p style={nameStyle}>{item.name}</p>
      <p style={ownerStyle}>{owner}</p>
    </div>
  </Link>
}



