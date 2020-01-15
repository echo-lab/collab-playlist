import { useState, useEffect } from 'react'


interface useApiOptions {
  active?: boolean,
  cache?: RequestCache,
}

export const useApi = (
  url: string, {
    active = true,
    cache = 'default',
  }: useApiOptions = {}
) => {
  
  const [result, setResult] = useState(null)
  
  useEffect(() => {
    if (!active) return
    
    (async () => {
      try {
        const data = await fetch(url, { cache: cache })
        if (!data.ok) {
          throw data.status
        }
        const json = await data.json()
        setResult(json)
        console.log(json)
      } catch (e) {
        console.error({e})
        if (400 <= e && e < 500) {
          // client error, request new access_token
          // TODO
        } else if (500 <= e && e < 600) {
          // server error
        }
      }
    })()
  }, [url, active, cache])
  
  return result
}




export const useSongSearch = (query) => {
  
  return useApi(`/api/search?q=${query}`, {
    active: query !== ''
  })?.body as SpotifyApi.TrackSearchResponse || null // TODO change api then...
  
}


export const usePlaylists = () => {
  return useApi('/api/playlists/') as SpotifyApi.PlaylistObjectSimplified[]
}




export const useRefreshToken = (isLoggedIn, logout) => {
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

