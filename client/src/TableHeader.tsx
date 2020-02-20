
import React from 'react'
import { classes, colors } from './styles'

export const tableFlexValues = {
  title: 2,
  artist: 1,
  album: 1,
  addedBy: 1,
  removeButtonWidth: '2.4rem',
  removeButtonPadding: '0.7rem',
}


const rowStyle = {
  ...classes.row,
  // height: '5.0rem',
  minHeight: '5.0rem', // idk why it only works with minHeight
  background: colors.grayscale.gray,
  padding: '0 2.0rem',
}
const entryStyle = {
  ...classes.text,
  margin: 'auto 2.0rem',
  color: colors.grayscale.lightText,
}
const titleStyle = {
  ...entryStyle,
  flex: tableFlexValues.title,
}
const artistStyle = {
  ...entryStyle,
  flex: tableFlexValues.artist,
}
const albumStyle = {
  ...entryStyle,
  flex: tableFlexValues.album,
}
const addedByStyle = {
  ...entryStyle,
  flex: tableFlexValues.addedBy,
}
const removeButtonStyle = {
  ...entryStyle,
  width: tableFlexValues.removeButtonWidth,
  padding: tableFlexValues.removeButtonPadding,
}

export const TableHeader = () => {
  
  return <div style={rowStyle}>
    <span style={titleStyle}>
      Title
    </span>
    <span style={artistStyle}>
      Artist
    </span>
    <span style={albumStyle}>
      Album
    </span>
    <span style={addedByStyle}>
      Added by
    </span>
    <span style={removeButtonStyle}></span>
  </div>
}

