
import React, { useCallback } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { CookiesProvider, useCookies } from 'react-cookie'
import { SearchTab } from './SearchTab'
import { colors, classes } from './styles'
import { useWarnResize } from './warnResize'
import { PlaylistTab } from './PlaylistTab'
import { useRefreshToken } from './api-hooks'


const useLogin = () => {
  const [cookies, , removeCookie] = useCookies(['access_token', 'refresh_token'])
  return [
    cookies.access_token && cookies.refresh_token,
    useCallback(() => {
      removeCookie('access_token')
      removeCookie('refresh_token')
    }, [removeCookie])
  ]
}




const MainPanel = () => {
  
  const mainPanelStyle = {
    ...classes.row,
    overflow: 'hidden',
    flex: 1,
  }
  
  return <div style={mainPanelStyle}>
    <SearchTab/>
    <PlaylistTab/>
  </div>
}

export const App = () => {
  const [isLoggedIn, logout] = useLogin()
  
  useRefreshToken(isLoggedIn, logout)
  
  useWarnResize()
  
  const appStyle = {
    ...classes.column,
    width: '100%',
    height: '100%',
    backgroundColor: colors.grayscale.black,
    boxSizing: 'border-box',
    padding: '0.5rem',
    // overflow: 'hidden',
  } as const
  const toolbarStyle = {
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
  
  return (
    <CookiesProvider>
      <Router>
        <div style={appStyle}>
          <div style={toolbarStyle}>
            <h1 style={headingStyle}>Collab-playlist test</h1>
            <button style={buttonStyle} onClick={logout}>Logout</button>
          </div>
          <Switch>
            <Route exact path="/">
              {isLoggedIn ? <MainPanel/> : <Redirect to="/login"/>}
            </Route>
            <Route path="/login">
              <a style={classes.text} href="/auth">Login</a>
            </Route>
            <Route>
              <Redirect to="/"/>
            </Route>
          </Switch>
        </div>
      </Router>
    </CookiesProvider>
  )
}

