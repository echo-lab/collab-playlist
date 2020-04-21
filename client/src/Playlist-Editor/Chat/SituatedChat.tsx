
import React from 'react'
import { classes } from '../../styles'
import * as styles from '../playlistTableRowStyles'
import { State } from '../modificationReducer'
import { SituatedMessageEditor } from './MessageEditor'


const chatStyle = {
  ...classes.column,
  flex: 1,
  margin: '0 1.0rem 1.0rem',
}


export const SituatedChat = ({
  action,
  id,
}: {
  action: State['userAction'], //'add' | 'remove' | 'view'
  id: string,
}) => {
  

  
  return <div style={classes.row}>
    <div style={styles.expandCollapseButtonStyle}>
      {/* Just a spacer */}
    </div>
    <div style={chatStyle}>
      <div>
        {/* TODO chat history */}
      </div>
      <SituatedMessageEditor action={action} trackId={id} />
    </div>
    <div style={styles.expandCollapseButtonStyle}>
      {/* Just a spacer */}
    </div>
  </div>
}



