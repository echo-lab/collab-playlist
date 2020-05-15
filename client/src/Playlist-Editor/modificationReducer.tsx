
import { createContext, Dispatch } from 'react'
import { PlaylistTrackObject } from '../shared/apiTypes'




interface AddState {
  userAction: 'add',
  songObject: PlaylistTrackObject,//SpotifyApi.TrackObjectFull,
}
interface RemoveState {
  userAction: 'remove',
  songId: string,
}
interface ViewState {
  userAction: 'view'
}
export type State =
  | AddState
  | RemoveState
  | ViewState

export const initialState: State = {
  userAction: 'view',
}



interface SelectAddAction {
  type: 'select-add',
  payload: {
    // id: string,
    songObject: PlaylistTrackObject,//SpotifyApi.TrackObjectFull,
  }
}
interface SelectRemoveAction {
  type: 'select-remove',
  payload: {
    songId: string,
  }
}
interface CancelAction {
  type: 'cancel',
  // payload: {
  // }
}
interface SubmitAddAction {
  type: 'submit-add',
  payload: {
    id: string,
    message: string,
  }
}
interface SubmitRemoveAction {
  type: 'submit-remove',
  payload: {
    id: string,
    message: string,
  }
}
export type Action =
  | SelectAddAction
  | SelectRemoveAction
  | CancelAction
  | SubmitAddAction
  | SubmitRemoveAction

export const modificationReducerContext = createContext<{
  modificationState: State,
  dispatch: Dispatch<Action>
}>(null)

export const modificationReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'select-add':
      // assume state.userAction === 'view'?
      return {
        userAction: 'add',
        songObject: action.payload.songObject,
      }
    case 'select-remove':
      // assume state.userAction === 'view'?
      return {
        userAction: 'remove',
        songId: action.payload.songId,
      }
    case 'cancel':
      // assume state.userAction === 'add' | 'remove'?
      return {
        userAction: 'view'
      }
    case 'submit-add':
      // assume state.userAction === 'add'?
      return {
        userAction: 'view'
      }
    case 'submit-remove':
      // assume state.userAction === 'remove'?
      return {
        userAction: 'view'
      }
  }
}

