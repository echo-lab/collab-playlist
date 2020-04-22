
import React, { CSSProperties } from 'react'
import { classes } from '../../styles'
// import * as styles from './playlistTableRowStyles'
// import { State } from './modificationReducer'
import { SeparateMessageEditor } from './MessageEditor'



export const SeparateChat = ({
  chat,
  reloadPlaylist,
  style,
}: {
  chat: any[],
  reloadPlaylist: () => void,
  style: CSSProperties,
}) => {
  
  const chatStyle = {
    ...classes.column,
    ...style,
  }
  
  return <div style={chatStyle}>
    <div>
      {/* TODO chat history */}
    </div>
    <div>
      <SeparateMessageEditor reloadPlaylist={reloadPlaylist} />
    </div>
  </div>
}

