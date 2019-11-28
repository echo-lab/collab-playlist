import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        Collab-playlist test
      </div>
      <Switch>
        <Route path="/login">
          <a href="/auth">Login</a>
        </Route>
        <Route exact path="/">
          <p>Logged in!</p>
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
