
import React, { useState } from 'react'
import { classes, colors } from '../styles'
import * as styles from './playlistTableRowStyles'
import { faPaperPlane, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { State } from './modificationReducer'
import { useHover } from '../useHover'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const chatStyle = {
  ...classes.column,
  flex: 1,
  margin: '0 1.0rem 1.0rem',
}


export const SongChat = ({
  action,
}: {
  action: State['userAction']//'add' | 'remove' | 'view'
}) => {
  

  
  return <div style={classes.row}>
    <div style={styles.expandCollapseButtonStyle}>
      {/* Just a spacer */}
    </div>
    <div style={chatStyle}>
      <div>
        {/* TODO chat history */}
      </div>
      <MessageEditor action={action} />
    </div>
    <div style={styles.expandCollapseButtonStyle}>
      {/* Just a spacer */}
    </div>
  </div>
}


const messageEditorStyle = {
  ...classes.row,
  // margin: '1.0rem 1.5rem',
  border: 'none',
  borderRadius: '2.25rem',
  background: colors.grayscale.darkerWhite,
  height: '4.5rem',
}
const inputStyle = {
  ...classes.text,
  background: colors.grayscale.white,
  color: colors.grayscale.black,
  border: 'none',
  borderRadius: '2.25rem',
  fontSize: '1.6rem',
  padding: '1.0rem 1.5rem',
  flex: 1,
}
const submitStyle = {
  ...classes.text,
  ...classes.button,
  color: colors.grayscale.black,
  height: '3.8rem',
  width: '3.8rem',
  padding: '0.7rem',
  margin: 'auto 0.5rem',
  borderRadius: '50%',
}

const MessageEditor = ({
  action,
}: {
  action: State['userAction']//'add' | 'remove' | 'view'
}) => {
  
  const [message, setMessage] = useState('')
  
  const [submitHovered, submitHoverProps] = useHover()
  
  const submitStyleDynamic = {
    ...submitStyle,
    background: colors.translucentBlack(submitHovered ? 0.2 : 0),
  }
  
  return <div style={messageEditorStyle}>
    <input
      type="text"
      style={inputStyle}
      value={message}
      onChange={e => setMessage(e.target.value)}
    />
    <button
      type="submit"
      style={submitStyleDynamic}
      {...submitHoverProps}
    >
      <FontAwesomeIcon
        icon={
          action === 'add'
          ? faPlusCircle
          : action === 'remove'
          ? faMinusCircle
          : faPaperPlane
        }
        style={classes.icon}
      />
    </button>
  </div>
}


