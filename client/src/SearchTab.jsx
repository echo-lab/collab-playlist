
import React, { useState } from 'react'
import { useDebounceCallback } from '@react-hook/debounce'
import { useSongSearch } from './api-hooks'

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

