


export interface GetRefreshTokenResponse {
  expires_in: number,
}


export interface GetPlaylistIdResponse extends SpotifyApi.SinglePlaylistResponse { }


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

