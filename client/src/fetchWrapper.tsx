
import { useState, useEffect, useRef } from 'react'

const useConst = <T extends any> (val: T) => {
  return useRef(val).current
}


// base type for api data and error
// TODO will api return arrays? then this will change
type Json = Record<string, any>

export interface Resource<T extends Json> {
  data: T,
  loading: boolean,
  error: {
    status: number,
    json: Json,
  }
}


/**
 * abstraction for a fetched resource
 * makes most sense for an idempotent request like GET;
 * can be used to store the response/loading/error for a nonidempotent
 * request like POST
 * 
 * updateResource (setter) has a stable reference identity
 */
export const useResource = <T extends Json>(
  initialVal: T,
  loading: boolean = false
) => {
  const [resource, setResource] = useState<Resource<T>>({
    data: initialVal,
    loading,
    error: null
  })
  
  // TODO remove this and just use setResource?
  const updateResource = useConst((updates: Partial<Resource<T>>) => {
    setResource(resource => ({
      ...resource,
      ...updates,
    }))
  })
  
  return [resource, updateResource] as const
}


/**
 * wrapper around fetch that handles errors and returns them as
 */
export const fetchWrapper = async <T extends Json> (
  url: string,
  fetchOptions: RequestInit = {},
): Promise<Pick<Resource<T>, 'data' | 'error'>> => {
  // fetch() and json() will reject (throw exceptions) on network error or if
  // the response can't be parsed as json, but not on application level error.
  // leave these exceptional cases unhandled
  const data = await fetch(url, fetchOptions)
  const json = await data.json() as Json
  console.log({ url, status: data.status, json })
  
  // data.ok is false if status is 4xx or 5xx (application level error)
  return data.ok
    ? { // success
      data: json as T,
      error: null,
    }
    : { // error
      data: null,
      error: {
        status: data.status,
        json,
      },
    }
}


export const postWrapper = async <T extends Json> (
  url: string,
  body: Json,
  fetchOptions: RequestInit = {},
): Promise<Pick<Resource<T>, 'data' | 'error'>> => {
  return await fetchWrapper(
    url,
    {
      method: 'POST',
      body: JSON.stringify(body),
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    }
  )
}


// TODO refactor in useRefreshToken.tsx
export const useRefreshToken = (isLoggedIn, logout) => {
  useEffect(() => {
    if (!isLoggedIn) return
    
    const refresh = async () => {
      try {
        const response = await fetch('/api/refresh_token', { cache: 'no-store' })
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

