
import { DB } from './nedbPromisified'
import { spotifyApi } from './ownerAccount'
import { PlaylistDocument, TrackObject } from '../client/src/shared/dbTypes'




/**
 * save playlist data to db the first time it's requested.
 * this will usually happen when an empty playlist is created by admins and a
 * user requests it for the first time
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


/**
 * spotifyPlaylist.tracks.items will be empty most of the time/in the real
 * world (so this wouldn't get called), but sometimes/when debugging the
 * playlist might already exist with songs so we need to get them into the db
 */
const initializeTrackObject = (spotifyTrack: SpotifyApi.PlaylistTrackObject): TrackObject => {
  return {
    id: spotifyTrack.track.id,
    chat: [],
    removed: false,
    addedBy: spotifyTrack.added_by.id,
  }
}


