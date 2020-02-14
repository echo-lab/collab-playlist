
import React, { useCallback } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { CookiesProvider, useCookies } from 'react-cookie'
import { SearchPanel } from './SearchPanel'
import { colors, classes } from './styles'
// import { useWarnResize } from './warnResize'
import { useRefreshToken } from './apiWrapper'
import { PlaylistGrid } from './PlaylistGrid'
import { PlaylistEditor } from './PlaylistEditor'


const useLogin = (): [boolean, () => void] => {
  const [cookies, , removeCookie] = useCookies(['access_token', 'refresh_token'])
  return [
    cookies.access_token && cookies.refresh_token,
    useCallback(() => {
      removeCookie('access_token')
      removeCookie('refresh_token')
    }, [removeCookie])
  ]
}



const Header = ({ logout }: { logout: () => void }) => {
  const headerStyle = {
    flexBasis: '6.0rem',
  }
  const headingStyle = {
    ...classes.text,
    ...classes.bold,
    fontSize: '2.5rem',
  }
  const buttonStyle = {
    ...classes.text,
    color: colors.grayscale.black,
  }
  
  return <div style={headerStyle}>
    <h1 style={headingStyle}>Collab-playlist test</h1>
    <button style={buttonStyle} onClick={logout}>Logout</button>
  </div>
}


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


const LoggedInPage = () => {
  
  const panelStyle = {
    ...classes.row,
    // overflow: 'hidden',
    height: '100%',
  }
  const playlistGridStyle = {
    flex: '1',
  }
  const playlistPanelStyle = {
    flex: '0.75',
  }
  
  return <div style={panelStyle}>
    <Switch>
      <Route exact path="/">
        <div style={playlistGridStyle}>
          <PlaylistGrid />
        </div>
      </Route>
      <Route path="/playlists/:id/">
        <SearchPanel/>
        <div style={playlistPanelStyle}>
          <PlaylistEditor />
        </div>
      </Route>
    </Switch>
  </div>
}

export const App = () => {
  const [isLoggedIn, logout] = useLogin()
  
  useRefreshToken(isLoggedIn, logout)
  
  // useWarnResize()
  
  const appStyle = {
    ...classes.column,
    width: '100%',
    height: '100%',
    backgroundColor: colors.grayscale.black,
    boxSizing: 'border-box',
    padding: '0.5rem',
    // overflow: 'hidden',
  } as const
  const mainPanelStyle = {
    overflow: 'hidden',
    flex: 1,
  }
  
  return (
    <CookiesProvider>
      <Router>
        <div style={appStyle}>
          <Header logout={logout} />
          <div style={mainPanelStyle}>
            <Switch>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Route path="/error/">
                <ErrorPage />
              </Route>
              <Route path="/">
                { isLoggedIn
                ? <LoggedInPage/>
                : <Redirect to="/login"/>
                }
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </CookiesProvider>
  )
}

