
import React, { useState, useEffect } from 'react'
import { useDebounceCallback } from '@react-hook/debounce'
import { useResource, apiWrapper, Resource } from './api-hooks'
import { SearchResults } from "./SearchResults"
import { classes, colors } from "./styles"


type SongResults = SpotifyApi.TrackSearchResponse | null

export const useSongSearch = (query: string): Resource<SongResults> => {
  const [{data: result, loading, error}, setter] = useResource<{body: SongResults}>(null) // TODO change API
  // eventually:
  // const [resource, setter] = useResource<SongResults>(null)
  
  useEffect(() => {
    if (query !== '') {
      apiWrapper(`/api/search?q=${query}`, setter)
    }
  }, [query, setter])
  
  // TODO return result either way and just show loading state/nothing if loading
  if (query === '') {
    return {
      data: null,
      loading: false,
      error: null,
    }
  } else {
    return {
      data: result?.body,
      loading,
      error
    }
  }
  
}


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
  
  const inputStyle = {
    ...classes.text,
    color: colors.grayscale.black,
  }
  
  return <input
    style={inputStyle}
    type="text"
    value={value}
    onChange={ ({ target: { value: newVal }}) => {
      setValue(newVal)
      debouncedOnChange(newVal)
    }}
  />
}


export const SearchPanel = () => {
  
  const [query, setQuery] = useState('')
  
  const { data: result } = useSongSearch(query)
  
  const searchTabStyle = {
    ...classes.column,
    flex: '0.25',
  }
  
  return <div style={searchTabStyle}>
    <DebouncedInput
      onChange={setQuery}
    />
    
    <SearchResults data={result} />
    
  </div>
}

