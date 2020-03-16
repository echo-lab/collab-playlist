
import { useState, useEffect, useRef } from 'react'

const useConst = <T extends any> (val: T) => {
  return useRef(val).current
}



export interface Resource<T> {
  data: T,
  loading: boolean,
  error: any
}


/**
 * abstraction for a fetched resource
 * makes most sense for an idempotent request like GET;
 * can be used to store the response/loading/error for a nonidempotent
 * request like POST
 * 
 * updateResource (setter) has a stable reference identity
 */
export const useResource = <T extends any>(
  initialVal: T,
  loading: boolean = false
) => {
  const [resource, setResource] = useState<Resource<T>>({
    data: initialVal,
    loading,
    error: null
  })
  
  const updateResource = useConst((updates: Partial<Resource<T>>) => {
    setResource(resource => ({
      ...resource,
      ...updates,
    }))
  })
  
  return [resource, updateResource] as const
}

class FetchError extends Error {
  public payload: any
  constructor(payload: any, message?: string) {
    super(message)
    this.payload = payload
  }
}

/**
 * wrapper around fetch that handles errors and returns them as
 */
export const apiWrapper = async <T extends any> (
  url: string,
  fetchOptions: RequestInit = {},
): Promise<{
  data: T,
  error: any,
}> => {
  try {
    
    const data = await fetch(url, fetchOptions)
    if (!data.ok) {
      throw new FetchError({ status: data.status })
    }
    const json = await data.json() as T
    console.log({ url, json })
    return {
      data: json,
      error: null,
    }
    
  } catch (e_) {
    const e = e_ as FetchError | Error
    console.error({ url, e })
    const { status } = 'payload' in e ? e.payload : 500
    
    if (400 <= status && status < 500) {
      // client error, request new access_token
      // TODO
    } else if (500 <= status && status < 600) {
      // server error
    }
    return {
      data: null,
      error: e,
    }
  }
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

