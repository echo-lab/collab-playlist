
import React from 'react'
import * as styles from './playlistTableRowStyles'
// import { colors } from './styles'


// const rowStyle = {
//   ...styles.rowStyle,
//   background: colors.grayscale.gray,
// }

export const PlaylistTableHeader = () => {
  return <div style={styles.rowStyle}>
    <div style={styles.expandCollapseButtonStyle}></div>
    <div style={styles.titleStyle}>
      Title
    </div>
    <div style={styles.artistStyle}>
      Artist
    </div>
    <div style={styles.albumStyle}>
      Album
    </div>
    <div style={styles.addedByStyle}>
      Added by
    </div>
    <div style={styles.rightButtonWrapperStyle}></div>
  </div>
}

