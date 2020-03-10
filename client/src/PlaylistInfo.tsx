
import React, { CSSProperties } from 'react'
import { classes, colors } from './styles'
import { Image } from './Image'





const containerStyle = {
  ...classes.row,
  justifyContent: 'space-between',
  // background: colors.grayscale.gray,
  // padding: '2.0rem 2.0rem 0',
}
const imageStyle = {
  width: '16.0rem',
  height: '16.0rem',
}
const middleContainerStyle: CSSProperties = {
  ...classes.column,
  marginLeft: '2.0rem',
  justifyContent: 'center',
  marginRight: 'auto',
  // alignSelf: 'center',
}
const titleStyle: CSSProperties = {
  ...classes.text,
  ...classes.bold,
  fontSize: '3.8rem',
}
const subtitleStyle = {
  ...classes.text,
  color: colors.grayscale.lightText,
}
const ownerStyle = {
  color: colors.grayscale.white,
}
const followersStyle = {
  ...classes.text,
  color: colors.grayscale.lightText,
  // verticalAlign: 'bottom',
  alignSelf: 'flex-end',
  textAlign: 'right',
  // margin: '2.0rem',
} as const
const followersCountStyle = {
  color: colors.grayscale.white,
}

export const PlaylistInfo = ({
  playlist,
}: {
  playlist: SpotifyApi.PlaylistObjectFull,
}) => {
  
  return <div style={containerStyle}>
    <Image
      src={playlist.images[0].url}
      alt={playlist.name}
      style={imageStyle}
    />
    <div style={middleContainerStyle}>
      <h2 style={titleStyle}>{playlist.name}</h2>
      <p style={subtitleStyle}>
        Created by{' '}
        <span style={ownerStyle}>
          {playlist.owner.display_name}
        </span>
      </p>
    </div>
    <span style={followersStyle}>
      <span style={followersCountStyle}>
        {playlist.followers.total}
      </span>{' '}
      Follower{playlist.followers.total !== 1 && 's'}
    </span>
  </div>
}


