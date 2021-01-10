

import { PlaylistDocument, UserDocument } from '../client/src/shared/dbTypes'
import { createNedbPromisified } from './nedbPromisified'


export const playlistsDB = createNedbPromisified<PlaylistDocument>(process.env.DB_PLAYLISTS)
export const usersDB     = createNedbPromisified<UserDocument>(process.env.DB_USERS)


