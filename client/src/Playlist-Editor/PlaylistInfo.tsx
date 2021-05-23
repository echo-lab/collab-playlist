
import React, { CSSProperties } from 'react'
import { classes, colors } from '../styles'
import { GetPlaylistIdResponse } from '../shared/apiTypes'





const containerStyle = {
  ...classes.row,
  justifyContent: 'space-between',
  // background: colors.grayscale.gray,
  // padding: '2.0rem 2.0rem 0',
}
const imageStyle = {
  ...classes.centeredClippedImage,
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
  playlist: GetPlaylistIdResponse,
}) => {
  
  return <div style={containerStyle}>
    <img
      src={playlist.image}
      alt={playlist.name}
      style={imageStyle}
    />
    <div style={middleContainerStyle}>
      <h2 style={titleStyle}>{playlist.name}</h2>
      <p style={followersStyle}>
        <span style={followersCountStyle}>
          {playlist.followers}
        </span>{' '}
        Follower{playlist.followers !== 1 && 's'}
      </p>
    </div>
  </div>
}


