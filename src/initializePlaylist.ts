
import { DB } from './nedbPromisified'
import { spotifyApi } from './ownerAccount'
import { PlaylistDocument, TrackObject } from '../client/src/shared/dbTypes'




/**
 * save playlist data to db the first time it's requested
 */
export const initializePlaylist = async (spotifyPlaylist: SpotifyApi.SinglePlaylistResponse, db: DB) => {
  // const { body: spotifyPlaylist } = await spotifyApi.getPlaylist(playlistId)
  
  // TODO handle error
  
  return await db.insert<PlaylistDocument>({
    _id: spotifyPlaylist.id,
    chatMode: 'hybrid',
    chat: [],
    tracks: spotifyPlaylist.tracks.items.map(initializeTrackObject),
  }) as PlaylistDocument
}


const initializeTrackObject = (playlistTrack: SpotifyApi.PlaylistTrackObject): TrackObject => {
  return {
    id: playlistTrack.track.id,
    chat: [],
    removed: false,
  }
}


