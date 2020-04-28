
import React from 'react'
import { classes } from '../../styles'
import * as styles from '../playlistTableRowStyles'
import { State } from '../modificationReducer'
import { SituatedMessageEditor } from './MessageEditor'
import { PlaylistTrackObject } from '../../shared/apiTypes'


const chatStyle = {
  ...classes.column,
  flex: 1,
  margin: '0 1.0rem 1.0rem',
}


export const SituatedChat = ({
  action,
  track,
}: {
  action: State['userAction'], //'add' | 'remove' | 'view'
  track: PlaylistTrackObject,
}) => {
  

  
  return <div style={classes.row}>
    <div style={styles.expandCollapseButtonStyle}>
      {/* Just a spacer */}
    </div>
    <div style={chatStyle}>
      <div style={classes.text}>
        {JSON.stringify(track.chat, null, 2)}
      </div>
      <SituatedMessageEditor action={action} trackId={track.id} />
    </div>
    <div style={styles.expandCollapseButtonStyle}>
      {/* Just a spacer */}
    </div>
  </div>
}



