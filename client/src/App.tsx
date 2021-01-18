
import React, { CSSProperties } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { colors, classes } from './styles'
// import { useWarnResize } from './warnResize'
import { useRefreshToken } from './auth'
import { PlaylistGrid } from './PlaylistGrid'
import { PlaylistEditor } from './Playlist-Editor/PlaylistEditor'
import { Header } from './Header'
import './errorCatcher'


const LoginPage = () => {
  return <a style={classes.text} href="/auth">Login</a>
}


const ErrorPage = () => {
  return <div style={classes.text}>
    There has been an error. Please{' '}
    <a target="_blank" rel="noopener noreferrer" href="https://www.google.com/search?q=how+to+clear+cookies">
      clear your cookies
    </a>{' '}
    and try again.
  </div>
}


const LoggedInPage = ({
  style,
}: {
  style?: CSSProperties,
}) => {
  useRefreshToken()
  
  return <Switch>
    <Route exact path="/">
      <PlaylistGrid style={style} />
    </Route>
    <Route path="/playlists/:id/">
      <PlaylistEditor style={style} />
    </Route>
  </Switch>
}



const appStyle = {
  ...classes.column,
  width: '100%',
  height: '100%',
  backgroundColor: colors.grayscale.black,
} as const
const mainPanelStyle = {
  overflow: 'hidden',
  flex: 1,
}
const loggedInPageStyle = {
  height: '100%',
}

export const App = () => {
  return (
    <Router>
      <div style={appStyle}>
        <Header />
        <div style={mainPanelStyle}>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/error/">
              <ErrorPage />
            </Route>
            {/* default/all other paths */}
            <Route path="/">
              <LoggedInPage style={loggedInPageStyle} />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}

