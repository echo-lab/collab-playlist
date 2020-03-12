
import React, { useState } from 'react'
import { classes, colors } from '../styles'
import * as styles from './playlistTableRowStyles'


const chatStyle = {
  ...classes.column,
  flex: 1,
  padding: '0 1.0rem 1.0rem',
}
const inputStyle = {
  ...classes.text,
  background: colors.grayscale.white,
  color: colors.grayscale.black,
  border: 'none',
  borderRadius: '2.0rem',
  fontSize: '1.6rem',
  padding: '1.0rem 1.5rem',
}

export const SongChat = () => {
  
  const [message, setMessage] = useState('')
  
  
  return <div style={classes.row}>
    <div style={styles.expandCollapseButtonStyle}></div>
    <div style={chatStyle}>
      {/* TODO chat history */}
      <input
        type="text"
        style={inputStyle}
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </div>
    <div style={styles.expandCollapseButtonStyle}></div>
  </div>
}


