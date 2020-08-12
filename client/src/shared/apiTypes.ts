
import { PlaylistDocument, TrackObject } from './dbTypes'



export interface GetRefreshTokenResponse {
  expires_in: number,
}


export interface PlaylistTrackObject
  extends SpotifyApi.PlaylistTrackObject, TrackObject { }

export interface GetPlaylistIdResponse extends
  PlaylistDocument,
  Pick<SpotifyApi.SinglePlaylistResponse,
    'images' | 'name' | 'owner' | 'followers'
  >
{
  tracks: PlaylistTrackObject[],
}
// export interface GetPlaylistIdResponse {
//   spotifyPlaylist: SpotifyApi.SinglePlaylistResponse,
//   tracks: PlaylistDocument['tracks'],
//   chat: PlaylistDocument['chat'],
//   chatMode: PlaylistDocument['chatMode'],
// }


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

export type GetPlaylistsResponse = SpotifyApi.PlaylistObjectSimplified[]

