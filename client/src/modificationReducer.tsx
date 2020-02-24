
import { createContext, Dispatch } from 'react'




interface AddOrRemoveState {
  userAction: 'add' | 'remove',
  id: string,
}
interface ViewState {
  userAction: 'view'
}
type State = AddOrRemoveState | ViewState

export const initialState: State = {
  userAction: 'view',
}



interface SelectAddAction {
  type: 'select-add',
  payload: {
    id: string,
    // song: SpotifyApi.TrackObjectFull,
  }
}
interface SelectRemoveAction {
  type: 'select-remove',
  payload: {
    id: string,
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
type Action =
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
        id: action.payload.id,
      }
    case 'select-remove':
      // assume state.userAction === 'view'?
      return {
        userAction: 'remove',
        id: action.payload.id,
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

