

// This type is defined in src/nedbPromisified, but that is not accessible
// to the client code, so we redundantly define it here
interface Document {
  _id: string,
}


/**
 * Common to any action/message that a user initiates
 */
interface Event {
  timestamp: Date,
  userId: string,
}


/**
 * A user leaves a message, possibly while adding/removing the track
 * If action is not 'comment', message can be empty string, otherwise message
 * shouldn't be an empty string, though this is not currently enforced
 * This occurs in situated or hybrid mode
 */
export interface SituatedChatEvent extends Event {
  message: string,
  action: 'comment' | 'add' | 'remove' | 're-add',
}


/**
 * When a track is added/removed, the backend will also log the event in the
 * separate chat using this type of object
 * Occurs in all modes for simplicity, though probably won't be shown in
 * situated mode
 */
export interface SeparateChatAction extends Event {
  action: 'add' | 'remove' | 're-add',
  trackId: string,
}
/**
 * A message the user leaves in the separate chat; not coupled to a track
 * Occurs in separate or hybrid mode
 */
export interface SeparateChatMessage extends Event {
  action: 'comment',
  message: string,
}
/**
 * The events shown in the separate chat are all one of these two types
 */
export type SeparateChatEvent = SeparateChatAction | SeparateChatMessage


/**
 * track in playlist that has either not been removed, or has been readded
 * Chat can be empty array if no messages/actions yet or if in separate mode
 */
export interface TrackObject {
  // not necessarily unique between different documents (playlists) because
  // different playlists can have the same track, so I'm not sure if I'm
  // allowed to use _id; instead I use id:
  id: string,
  // user id of adder; different from spotify api bc the owner account will
  // always be the adder in spotify's data:
  addedBy: string,
  chat: SituatedChatEvent[], // situated
}

/**
 * Similar to TrackObject, but keeps track of who removed it
 * TODO extend Pick<SpotifyApi.TrackObjectFull, 'name' | 'album' | 'artists'>
 *  like api's PlaylistTrackObject (and refactor api to have just needed data)
 */
export interface RemovedTrackObject {
  id: string,
  // user id of remover
  removedBy: string,
  chat: SituatedChatEvent[], // situated
}

/**
 * A playlist with all its messages
 * Chat can be empty array if no messages/actions yet or if in situated mode
 */
export interface PlaylistDocument extends Document {
  users: string[], // many-to-many
  tracks: TrackObject[],
  removedTracks: RemovedTrackObject[],
  chat: SeparateChatEvent[], // separate
  chatMode: 'situated' | 'separate' | 'hybrid',
}





/**
 * An entry in the Users collection
 * keeps track of the playlists a user belongs to
 */
export interface UserDocument extends Document {
  playlists: string[], // many-to-many
}


