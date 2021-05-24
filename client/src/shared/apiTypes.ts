
import { PlaylistDocument, TrackObject } from './dbTypes'



export interface GetLoginResponse {
  userId: string,
}

export interface GetRefreshTokenResponse {
  expires_in: number,
}


export interface PlaylistTrackObject extends TrackObject {
  name: string,
  album: string,
  artists: string,
}

export interface GetPlaylistIdResponse extends PlaylistDocument {
  tracks: PlaylistTrackObject[],
  name: string,
  followers: number,
  image: string,
}


export interface PostSituatedChatRequest {
  message: string
}

export interface PutTrackRemovedRequest {
  remove: boolean,
  message: string,
}

export interface PostTrackRequest {
  message: string,
  trackId: string,
}

export interface PostSeparateChatRequest {
  message: string
}


export interface GetTrackSearchItem {
  id: string,
  name: string,
  album: string,
  artists: string,
  image: string,
}
export type GetTrackSearchResponse = GetTrackSearchItem[]

export interface PlaylistSimple {
  id: string,
  users: string[], // ids or display names?
  name: string,
  image: string, // temporary source url from spotify
}
export type GetPlaylistsResponse = PlaylistSimple[]

