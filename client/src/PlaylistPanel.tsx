
import React, { CSSProperties } from 'react'
import { Switch, Route } from 'react-router-dom'
import { PlaylistGrid } from './PlaylistGrid'
import { PlaylistEditor } from './PlaylistEditor'




export const PlaylistPanel = () => {
  
  const playlistPanelStyle: CSSProperties = {
    flex: '0.75',
  }
  
  return <div style={playlistPanelStyle}>
    <Switch>
      <Route exact path="/">
        <PlaylistGrid />
      </Route>
      <Route path="/playlists/:id/">
        <PlaylistEditor />
      </Route>
    </Switch>
  </div>
}


