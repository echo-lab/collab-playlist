
import React, { CSSProperties } from 'react'
import { classes, colors } from './styles'

export const Header = ({ logout }: { logout: () => void }) => {
  const headerStyle: CSSProperties = {
    ...classes.row,
    // flexBasis: '6.0rem',
    padding: '2.0rem',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
  const headingStyle = {
    ...classes.text,
    ...classes.bold,
    fontSize: '3.5rem',
  }
  const buttonStyle = {
    ...classes.text,
    color: colors.grayscale.black,
  }
  
  return <div style={headerStyle}>
    <h1 style={headingStyle}>Collaborative Playlist Editor</h1>
    <button style={buttonStyle} onClick={logout}>Logout</button>
  </div>
}

