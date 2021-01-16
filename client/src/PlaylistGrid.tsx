
import React, { CSSProperties, useEffect } from 'react'
import { classes, colors } from './styles'
import { useHover } from './useHover'
import { Link } from 'react-router-dom'
import { useResource, fetchWrapper, Resource } from './fetchWrapper'
import { GetPlaylistsResponse, PlaylistSimple } from './shared/apiTypes'
import { handleApiError } from './api'




export const usePlaylists = (): Resource<GetPlaylistsResponse> => {
  const [resource, setter] = useResource<GetPlaylistsResponse>(null, true)
  
  useEffect(() => {
    (async () => {
      // setter({ loading: true })
      const response = await fetchWrapper<GetPlaylistsResponse>('/api/playlists/')
      handleApiError(response)
      setter({
        loading: false,
        ...response,
      })
    })()
  }, [setter])
  
  return resource
}



export const PlaylistGrid = ({
  style,
}: {
  style?: CSSProperties,
}) => {
  const { data: playlists, loading } = usePlaylists()
  
  const playlistGridStyle: CSSProperties = {
    ...style,
    padding: '2.0rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(50.0rem, 1fr))',
    gridAutoRows: 'minmax(min-content, max-content)',
  }
  
  return <div style={playlistGridStyle}>
    {!loading && (
      playlists.length
      ? playlists.map(playlist => <PlaylistCard key={playlist.id} playlist={playlist} />)
      : <h2 style={classes.text}>You are not a member of any playlists.</h2>
    )}
  </div>
}



const imageStyle = {
  ...classes.centeredClippedImage,
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
const usersStyle = {
  ...classes.text,
  ...classes.textOverflow(),
}

const PlaylistCard = ({ playlist }: { playlist: PlaylistSimple }) => {
  
  const [isHovered, hoverProps] = useHover()
  
  const playlistCardStyle = {
    ...classes.row,
    ...(isHovered && { backgroundColor: colors.grayscale.darkGray }),
    padding: '2.0rem',
  }
  
  return <Link
    to={`/playlists/${playlist.id}/`}
    style={playlistCardStyle}
    {...hoverProps}
  >
    <img src={playlist.image} alt="" style={imageStyle} />
    <div style={textDivStyle}>
      <p style={nameStyle}>{playlist.name}</p>
      <p style={usersStyle}>{playlist.users.join(', ')}</p>
    </div>
  </Link>
}



