
import { useState, useRef } from 'react'

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



