
import React, { CSSProperties } from 'react'
import { useLogout } from './auth'
import { classes, colors } from './styles'


const headerStyle: CSSProperties = {
  ...classes.row,
  // flexBasis: '6.0rem',
  padding: '2.0rem',
  alignItems: 'center',
  justifyContent: 'space-between',
}
const leftBoxStyle = {
  ...classes.row,
  alignItems: 'baseline',
  verticalAlign: 'middle',
}
const headingStyle = {
  ...classes.text,
  ...classes.bold,
  fontSize: '3.5rem',
}
const forTextStyle = {
  ...classes.text,
  paddingLeft: '2.5rem',
  paddingRight: '2.5rem',
  fontSize: '1.6rem',
  fontStyle: 'italic',
}
const imageStyle = {
  height: '4.5rem',
  alignSelf: 'center',
}
const buttonStyle = {
  ...classes.text,
  color: colors.grayscale.black,
}

export const Header = () => {
  
  const logout = useLogout()
  
  return <div style={headerStyle}>
    <div style={leftBoxStyle}>
      <h1 style={headingStyle}>Collaborative Playlist Editor</h1>
      <span style={forTextStyle}>for</span>
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png"
        alt="Spotify"
        style={imageStyle}
      />
    </div>
    <button style={buttonStyle} onClick={logout}>Logout</button>
  </div>
}

