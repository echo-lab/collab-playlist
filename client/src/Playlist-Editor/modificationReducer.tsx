
import { PlaylistTrackObject } from '../shared/apiTypes'



export interface DraftTrackData extends Pick<PlaylistTrackObject,
  'id' | 'name' | 'album' | 'artists'
> { }


interface AddState {
  userAction: 'add',
  trackData: DraftTrackData,
}
interface RemoveState {
  userAction: 'remove',
  trackId: string,
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


