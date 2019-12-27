
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { CookiesProvider, useCookies } from 'react-cookie'
import { SearchTab } from './SearchTab'



const useLogin = () => {
  const [cookies, , removeCookie] = useCookies(['access_token', 'refresh_token'])
  return [
    cookies.access_token && cookies.refresh_token,
    () => {
      removeCookie('access_token')
      removeCookie('refresh_token')
    }
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
    flex: 1,
    display: 'flex',
    overflow: 'hidden'
  }
  
  return <div style={mainPanelStyle}>
    <SearchTab/>
    <PlaylistTab/>
  </div>
}

export const App = () => {
  const [isLoggedIn, logout] = useLogin()
  
  useRefreshToken(isLoggedIn, logout)
  
  const appStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
  const toolbarStyle = {
    flexBasis: '60px',
  }
  
  return (
    <CookiesProvider>
      <Router>
        <div style={appStyle}>
          <div style={toolbarStyle}>
            Collab-playlist test
            <button onClick={logout}>Logout</button>
          </div>
          <Switch>
            <Route exact path="/">
              {isLoggedIn ? <MainPanel/> : <Redirect to="/login"/>}
            </Route>
            <Route path="/login">
              <a href="/auth">Login</a>
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

// export default App
