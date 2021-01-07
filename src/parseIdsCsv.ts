

import { promises as fs } from 'fs'
import { PlaylistDocument } from '../client/src/shared/dbTypes'



export interface PlaylistIdsConfig {
  playlistId: string,
  chatMode: PlaylistDocument['chatMode'],
  userIds: string[],
}


/**
 * organize the data in ids.csv into one structure grouped by playlist and
 * another structure grouped by user
 */
export const parseIdsCsv = async (fileName: string) => {
  const contents = await fs.readFile(fileName, 'utf-8')
  const lines = contents
    .split(/\r\n|\n/)
    .map(line => line.split('#')[0]) // ignore anything after # (comment)
    .filter(line => line !== '') // filter empty lines
  
  // safer to use a Map when dealing with unknown keys
  const byUser = new Map<string, string[]>()
  
  const byPlaylist = lines.map((line): PlaylistIdsConfig => {
    const fields = line.split(',')
    const playlistId = fields[0]
    const userIds = fields.slice(2).filter(field => field !== '')
    
    for (const userId of userIds) {
      if (!byUser.has(userId)) byUser.set(userId, [])
      byUser.get(userId).push(playlistId)
    }
    
    return {
      playlistId,
      chatMode: parseChatMode(fields[1]),
      // rest of the fields are user ids; ignore empty strings/trailing commas.
      // userIds can be empty
      userIds,
    }
  })
  return { byPlaylist, byUser }
}
 
const parseChatMode = (chatMode: string): PlaylistDocument['chatMode'] => {
  if (chatMode === 'situated'
    || chatMode === 'separate'
    || chatMode === 'hybrid'
  ) {
    return chatMode
  } else {
    throw {
      type: 'invalid chatMode',
      error: new Error(`chatMode ${chatMode} invalid`)
    }
  }
}

