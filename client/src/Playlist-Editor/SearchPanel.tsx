
import React, { useState, useEffect, CSSProperties } from 'react'
import { useDebounceCallback } from '@react-hook/debounce'
import { useResource, fetchWrapper, Resource } from '../fetchWrapper'
import { SearchResults } from "./SearchResults"
import { classes, colors } from "../styles"
import { handleApiError } from '../api'


type SongResults = SpotifyApi.TrackSearchResponse

export const useSongSearch = (query: string): Resource<SongResults> => {
  const [resource, setter] = useResource<SongResults>(null)
  
  useEffect(() => {
    if (query !== '') {
      (async () => {
        setter({
          loading: true,
        })
        const response = await fetchWrapper<SongResults>(`/api/search?q=${query}`)
        handleApiError(response)
        setter({
          loading: false,
          ...response,
        })
      })()
    } else {
      setter({
        loading: false,
        data: null,
        error: null,
      })
    }
  }, [query, setter])
  
  return resource
  
}


/**
 * Text input field that calls onChange only when user stops typing for {delay} ms
 * 
 * @prop {onChange} should be a callback with the same object reference between
 * re-renders (i.e. from useState, useCallback)
 */
const DebouncedInput = ({
  onChange,
  delay = 500,
  style,
  placeholder,
}: {
  onChange: (arg: string) => void,
  delay?: number,
  style?: CSSProperties,
  placeholder?: string,
}) => {
  // the controlled input state, gets updated immediately on change:
  const [value, setValue] = useState('')
  // debounced wrapper for onChange
  const debouncedOnChange = useDebounceCallback(onChange, delay)
  
  return <input
    style={style}
    type="text"
    value={value}
    placeholder={placeholder}
    onChange={ ({ target: { value: newVal }}) => {
      setValue(newVal)
      debouncedOnChange(newVal)
    }}
  />
}


export const SearchPanel = ({
  style,
}: {
  style?: CSSProperties,
}) => {
  
  const [query, setQuery] = useState('')
  
  const { data: result } = useSongSearch(query)
  
  const searchTabStyle = {
    ...style,
    ...classes.column,
    padding: '2.0rem',
    backgroundColor: colors.grayscale.darkerGray,
  }
  const inputStyle = {
    ...classes.text,
    color: colors.grayscale.black,
    height: '3.0rem',
    borderRadius: '1.5rem',
    border: 'none',
    padding: '0 1.5rem',
    boxSizing: 'border-box',
    marginBottom: '2.0rem',
    verticalAlign: 'middle',
  } as const
  const resultsStyle = {
    flex: 1,
  }
  
  return <div style={searchTabStyle}>
    <DebouncedInput
      onChange={setQuery}
      style={inputStyle}
      placeholder="Search to add track..."
    />
    
    { result &&
      <SearchResults
        style={resultsStyle}
        data={result}
      />
    }
    
  </div>
}

