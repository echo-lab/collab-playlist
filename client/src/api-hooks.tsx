
import { useState, useEffect, useRef } from 'react'

const useConst = <T extends any> (val: T) => {
  return useRef(val).current
}


interface useApiOptions {
  active?: boolean,
  cache?: RequestCache,
}

// TODO migrate to apiWrapper and deprecate
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

type Setter<T> = React.Dispatch<T>
type ResourceSetters<T> = [Setter<T>, Setter<boolean>, Setter<any>]

export type Resource<T> = [T, boolean, any]

export const useResource = <T extends any>(initialVal: T = null): [Resource<T>, ResourceSetters<T>] => {
  const [data, setData] = useState(initialVal)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  return [ [
      data,
      loading,
      error
    ],
    useConst([ setData, setLoading, setError ])
  ]
}

class FetchError extends Error {
  public payload: any
  constructor(payload: any, message?: string) {
    super(message)
    this.payload = payload
  }
}

export const apiWrapper = async <T extends any> (
  url: string,
  [ setData, setLoading, setError ]: ResourceSetters<T>,
  fetchOptions: RequestInit = {},
) => {
  try {
    setLoading(true)
    const data = await fetch(url, fetchOptions)
    if (!data.ok) {
      throw new FetchError({ status: data.status })
    }
    const json = await data.json()
    setData(json)
    setLoading(false)
    setError(null)
    console.log({ url, json })
  } catch (e_) {
    const e = e_ as FetchError
    console.error({ url, e })
    const { status } = e.payload
    setData(null)
    setLoading(false)
    setError(e)
    if (400 <= status && status < 500) {
      // client error, request new access_token
      // TODO
    } else if (500 <= status && status < 600) {
      // server error
    }
  }
}



// export const usePlaylists = () => {
//   return useApi('/api/playlists/') as SpotifyApi.PlaylistObjectSimplified[]
// }




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

