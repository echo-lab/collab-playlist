
import React, { useState } from 'react'
import { useDebounceCallback } from '@react-hook/debounce'
import { useSongSearch } from './api-hooks'
import { SearchResults } from "./SearchResults"
import { classes } from "./styles"


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


export const SearchTab = () => {
  
  const [query, setQuery] = useState('hello')
  
  const result = useSongSearch(query)
  
  const searchTabStyle = {
    ...classes.column,
    flex: '0.25',
  }
  
  return <div style={searchTabStyle}>
    <DebouncedInput
      onChange={setQuery}
    />
    <h1 style={classes.text}>{query}</h1>
    <SearchResults data={result} />
    
  </div>
}

