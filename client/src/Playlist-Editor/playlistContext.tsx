
import { createContext, Dispatch } from 'react'
import { State, Action } from './modificationReducer'



export const playlistContext = createContext<{
  modificationState: State,
  dispatch: Dispatch<Action>,
  loadPlaylist: () => Promise<void>,
}>(null)


