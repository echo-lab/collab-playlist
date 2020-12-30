

import { PlaylistDocument } from '../client/src/shared/dbTypes'
import { createNedbPromisified } from './nedbPromisified'


export const db = createNedbPromisified<PlaylistDocument>(process.env.DB_PLAYLISTS)


