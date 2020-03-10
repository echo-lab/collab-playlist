
import React from 'react'
import * as styles from './playlistTableRowStyles'
// import { colors } from './styles'


// const rowStyle = {
//   ...styles.rowStyle,
//   background: colors.grayscale.gray,
// }

export const PlaylistTableHeader = () => {
  return <tr style={styles.rowStyle}>
    <th style={styles.expandCollapseButtonStyle}></th>
    <th style={styles.titleStyle}>
      Title
    </th>
    <th style={styles.artistStyle}>
      Artist
    </th>
    <th style={styles.albumStyle}>
      Album
    </th>
    <th style={styles.addedByStyle}>
      Added by
    </th>
    <th style={styles.removeButtonStyle}></th>
  </tr>
}

