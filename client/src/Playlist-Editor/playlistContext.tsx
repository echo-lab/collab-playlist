
import { createContext, Dispatch } from 'react'
import { State } from './modificationReducer'



export const playlistContext = createContext<{
  modificationState: State,
  setModificationState: Dispatch<State>,
  loadPlaylist: () => Promise<void>,
}>(null)


