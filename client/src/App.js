import React, {  } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { CookiesProvider, useCookies } from 'react-cookie'
import { SearchTab } from './SearchTab'



const useLogin = () => {
  // eslint-disable-next-line
  const [cookies, _, removeCookie] = useCookies(['access_token', 'refresh_token'])
  return [
    cookies.access_token && cookies.refresh_token,
    () => {
      removeCookie('access_token')
      removeCookie('refresh_token')
    }
  ]
}

export default () => {
  // const isLoggedIn = useLoginState()
  // const logout = useLogout()
  const [isLoggedIn, logout] = useLogin()
  
  return (
    <CookiesProvider>
      <Router>
        <div className="App">
          Collab-playlist test
          <button onClick={logout}>Logout</button>
        </div>
        <Switch>
          <Route exact path="/">
            {isLoggedIn ? <SearchTab/> : <Redirect to="/login"/>}
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

// export default App
