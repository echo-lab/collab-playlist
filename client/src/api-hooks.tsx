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
  
  return useApi(`/api/search/?q=${query}`, {
    active: query !== ''
  })?.body as SpotifyApi.TrackSearchResponse || null // TODO change api then...
  
}


export const usePlaylists = () => {
  return useApi('/api/playlists/') as SpotifyApi.PlaylistObjectSimplified[]
}

