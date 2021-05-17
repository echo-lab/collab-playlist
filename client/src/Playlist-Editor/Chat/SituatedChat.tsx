
import React from 'react'
import { classes } from '../../styles'
import * as styles from '../playlistTableRowStyles'
import { State } from '../modificationReducer'
import { SituatedMessageEditor } from './MessageEditor'
import { PlaylistTrackObject } from '../../shared/apiTypes'
import { SituatedChatMessage } from './ChatMessage'


const chatStyle = {
  ...classes.column,
  flex: 1,
  margin: '0 1.0rem 1.0rem',
}


export const SituatedChat = ({
  track,
  action,
  onSubmit,
  onCancel,
}: {
  track: PlaylistTrackObject,
  action: State['userAction'], //'add' | 'remove' | 'view'
  onSubmit: (message: string) => Promise<boolean>,
  onCancel: () => void,
}) => {
  

  
  return <div style={classes.row}>
    <div style={styles.expandCollapseButtonStyle}>
      {/* Just a spacer */}
    </div>
    <div style={chatStyle}>
      <div style={classes.column}>
        { track.chat.map((chatEvent, index) =>
          <SituatedChatMessage chatEvent={chatEvent} key={index} />
        ) }
      </div>
      <SituatedMessageEditor
        action={action}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
    <div style={styles.expandCollapseButtonStyle}>
      {/* Just a spacer */}
    </div>
  </div>
}



