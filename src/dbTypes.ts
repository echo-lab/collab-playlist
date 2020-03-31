
import { Document } from './nedbPromisified'


/**
 * Common to any action/message that a user initiates
 */
interface Event {
  timestamp: Date,
  userId: string,
}


/**
 * A user leaves a message, possibly while adding/removing a track
 * If action included, message can be empty string, otherwise message
 * shouldn't be an empty string
 * This occurs in situated or hybrid mode
 */
export interface SituatedChatEvent extends Event {
  message: string,
  action?: 'add' | 'remove',
}


/**
 * When a track is added/removed, the backend will also log the event in the
 * separate chat using this type of object
 * Occurs in all modes for simplicity, though probably won't be shown in
 * situated mode
 */
export interface SeparateChatAction extends Event {
  type: 'action',
  action: 'add' | 'remove',
  trackId: string,
}
/**
 * A message the user leaves in the separate chat; not coupled to a track
 * Occurs in separate or hybrid mode
 */
export interface SeparateChatMessage extends Event {
  type: 'message',
  message: string,
}
/**
 * The events shown in the separate chat are all one of these two types
 */
export type SeparateChatEvent = SeparateChatAction | SeparateChatMessage


/**
 * track in playlist; keeps track of whether it has been removed or not (or
 * readded)
 * Chat can be empty array if no messages/actions yet or if in separate mode
 */
export interface TrackObject {
  // not necessarily unique between different documents (playlists) because
  // different playlists can have the same track, so I'm not sure if I'm
  // allowed to use _id; instead I use id:
  id: string,
  chat: SituatedChatEvent[], // situated
  removed: boolean,
}

/**
 * A playlist with all its messages
 * Chat can be empty array if no messages/actions yet or if in situated mode
 */
export interface PlaylistDocument extends Document {
  tracks: TrackObject[],
  chat: SeparateChatEvent[], // separate
  chatMode: 'situated' | 'separate' | 'hybrid',
}

