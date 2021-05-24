
import { PlaylistDocument, TrackObject } from '../client/src/shared/dbTypes'
import { playlistsDB } from './db'
import { PlaylistIdsConfig } from './parseIdsCsv'



/**
 * save playlist data to db the first time it's requested.
 * this will usually happen when an empty playlist is created by admins and a
 * user requests it for the first time
 */
export const initializePlaylist = async (
  spotifyPlaylist: SpotifyApi.SinglePlaylistResponse, config: PlaylistIdsConfig
) => {
  return await playlistsDB.insert<PlaylistDocument>({
    _id: config.playlistId,
    chatMode: config.chatMode,
    users: config.userIds,
    chat: [],
    tracks: spotifyPlaylist.tracks.items.map(initializeTrackObject),
    removedTracks: [],
  })
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
    addedBy: spotifyTrack.added_by.id, // TODO will always be wrong, wont-fix?
  }
}


