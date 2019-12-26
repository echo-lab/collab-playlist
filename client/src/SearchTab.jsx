
import React, { useState, useEffect } from 'react'
import { useDebounceCallback } from '@react-hook/debounce'
// import SpotifyWebApi from 'spotify-web-api-js'
import { useCookies } from 'react-cookie'

/**
 * Text input field that calls onChange only when user stops typing for {delay} ms
 * 
 * @prop {onChange} should be a callback with the same object reference between
 * re-renders (i.e. from useState, useCallback)
 */
const DebouncedInput = ({ onChange, delay = 500 }) => {
  // the controlled input state, gets updated immediately on change:
  const [value, setValue] = useState('')
  // debounced wrapper for onChange
  const debouncedOnChange = useDebounceCallback(onChange, delay)
  
  return <input
    type="text"
    value={value}
    onChange={ ({ target: { value: newVal }}) => {
      setValue(newVal)
      debouncedOnChange(newVal)
    }}
  />
}


// const useSongSearch = (query) => {
//   // TODO move to global context
//   const [spotifyApi] = useState(() => new SpotifyWebApi())
//   // TODO ? useState(() => { const ret = new SpotifyWebApi(); ret.set...(); return ret })
//   const [ready, setReady] = useState(false)
//   const [cookies] = useCookies(['access_token'])
//   useEffect(() => {
//     spotifyApi.setAccessToken(cookies.access_token)
//     setReady(true)
//   }, [spotifyApi, cookies.access_token])

//   const [result, setResult] = useState(null)
  
//   useEffect(() => {
//     if (!ready) return
//     if (query === '') return
    
//     (async () => {
//       try {
//         const data = await spotifyApi.searchTracks(query)
//         console.log('Artist albums', data);
//         setResult(data)
//       } catch (err) {
//         console.error({err});
//         setResult(null)
//       }
//     })()
//   }, [spotifyApi, ready, query])
  
//   return result
// }

const useSongSearch = (query) => {
  const [result, setResult] = useState(null)
  
  useEffect(() => {
    if (query === '') return
    
    (async () => {
      try {
        const data = await fetch(`/api/search/?q=${query}`)
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
  }, [query])
  
  return result
}


export const SearchTab = () => {
  
  const [query, setQuery] = useState('')
  
  const result = useSongSearch(query)
  
  return <div style={{height: '100%'}}>
    <DebouncedInput
      onChange={setQuery}
    />
    <h1>{query}</h1>
    {JSON.stringify(result, null, 2).split('\n').map((item, i) =>
      <pre style={{margin: 0}} key={i}>{item/*.replace(/ /, '\t')*/}</pre>
    )}
    
  </div>
}

