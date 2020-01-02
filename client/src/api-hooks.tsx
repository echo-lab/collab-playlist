import { useState, useEffect, useCallback } from 'react'



const useApi = (url, { condition = () => true }) => {
  const [result, setResult] = useState(null)
  
  useEffect(() => {
    if (!condition()) return
    
    (async () => {
      try {
        const data = await fetch(url)
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
  }, [url, condition])
  
  return result
}




export const useSongSearch = (query) => {
  
  return useApi(`/api/search/?q=${query}`, {
    condition: useCallback(
      () => query !== '',
      [query]
    )
  })
  
}

