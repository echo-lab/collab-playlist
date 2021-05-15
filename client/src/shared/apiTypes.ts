
import { PlaylistDocument, TrackObject } from './dbTypes'



export interface GetLoginResponse {
  userId: string,
}

export interface GetRefreshTokenResponse {
  expires_in: number,
}


export interface PlaylistTrackObject extends
  TrackObject,
  Pick<SpotifyApi.TrackObjectFull,
    'name' | 'album' | 'artists'
  > { }

export interface GetPlaylistIdResponse extends
  PlaylistDocument,
  Pick<SpotifyApi.SinglePlaylistResponse,
    'images' | 'name' | 'owner' | 'followers'
  >
{
  tracks: PlaylistTrackObject[],
}


export interface PostSituatedChatRequest {
  message: string
}

export interface PutTrackRemovedRequest {
  message: string
}

export interface PostTrackRequest {
  message: string,
  trackId: string,
}

export interface PostSeparateChatRequest {
  message: string
}


export interface GetTrackSearchResponse extends SpotifyApi.SearchResponse {
  
}

export interface PlaylistSimple {
  id: string,
  users: string[], // ids or display names?
  name: string,
  image: string, // temporary source url from spotify
}
export type GetPlaylistsResponse = PlaylistSimple[]

