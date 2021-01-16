

import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { fetchWrapper } from './fetchWrapper'


/**
 * returns imperative function to log the user out
 */
export const useLogout = () => {
  const history = useHistory()
  
  return () => {
    // clear both cookies
    document.cookie = 'access_token=; path=/'
    document.cookie = 'refresh_token=; path=/'
    // navigate to login page because the other pages shouldn't be accessed when
    // not logged in
    history.push('/login')
  }
}



/**
 * useEffect for setting up and cleaning up hourly calls to refresh_token
 * to refresh access_token and keep the login session alive
 */
export const useRefreshToken = () => {
  useEffect(() => {
    let timeout // setTimeout id
    const refresh = async () => {
      // TODO catch fetch exception?
      const { data, error } = await fetchWrapper<{ expires_in: number }>(
        '/api/refresh_token', { cache: 'no-store' }
      )
      if (error) {
        if (400 <= error.status && error.status < 500) {
          // client error, tell user to re-authenticate
          // TODO use proper helper
          alert('please log out and log in again')
          // don't restart timeout;
          // if clearTimeout(timeout) gets called later nothing bad happens
          
        } else if (500 <= error.status && error.status < 600) {
          // server error, retry in 10s
          timeout = setTimeout(refresh, 1000 * 10)
        }
        
      } else {
        // success
        // anticipate expiration by a little
        timeout = setTimeout(refresh, data.expires_in * 1000 * 0.9)
      }
      
    }
    
    // initial call in 10s
    timeout = setTimeout(refresh, 1000 * 10)
    return () => {
      // clear timeout on unmount of calling component (when no longer logged
      // in)
      clearTimeout(timeout)
    }
  }, [])
}

