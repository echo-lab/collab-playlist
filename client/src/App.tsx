
import React, { useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { CookiesProvider, useCookies } from 'react-cookie'
import { SearchTab } from './SearchTab'
import { colors, classes } from './styles'
import { useWarnResize } from './warnResize'



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


const useRefreshToken = (isLoggedIn, logout) => {
  useEffect(() => {
    if (!isLoggedIn) return
    
    const refresh = async () => {
      try {
        const response = await fetch('/api/refresh_token')
        if (!response.ok) {
          throw response.status
        }
        const { expires_in } = await response.json() // number of seconds to expiration
        console.log({expires_in})
        setTimeout(refresh, expires_in * 1000 * 0.9) // anticipate expiration by a little
      } catch (e) {
        console.error({e})
        if (400 <= e && e < 500) {
          // client error, tell user to re-authenticate
          // alert('please login again')
          logout()
        } else if (500 <= e && e < 600) {
          // server error, retry
          setTimeout(refresh, 1000 * 10)
        }
      }
    }
    setTimeout(refresh, 1000 * 10)
  }, [isLoggedIn, logout])
}


const PlaylistTab = () => {
  return <div></div>
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

