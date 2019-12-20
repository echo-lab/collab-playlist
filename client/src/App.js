import React, { useCallback } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { CookiesProvider, useCookies } from 'react-cookie'


const useLoginState = () => {
  const [cookies, _, __] = useCookies(['access_token', 'refresh_token'])
  return cookies.access_token && cookies.refresh_token
}

const useLogout = () => {
  const [_, __, removeCookie] = useCookies(['access_token', 'refresh_token'])
  return () => {
    removeCookie('access_token')
    removeCookie('refresh_token')
  }
}

const App = () => {
  const isLoggedIn = useLoginState()
  const logout = useLogout()
  
  return (
    <CookiesProvider>
      <Router>
        <div className="App">
          Collab-playlist test
          <button onClick={logout}>Logout</button>
        </div>
        <Switch>
          <Route exact path="/">
            {isLoggedIn ? <p>Logged in!</p> : <Redirect to="/login"/>}
          </Route>
          <Route path="/login">
            <a href="/auth">Login</a>
          </Route>
          <Route>
            <Redirect to="/"/>
          </Route>
        </Switch>
      </Router>
    </CookiesProvider>
  )
}

export default App
