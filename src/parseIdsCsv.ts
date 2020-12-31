

import { promises as fs } from 'fs'
import { PlaylistDocument } from '../client/src/shared/dbTypes'



interface PlaylistIdsConfig {
  playlistId: string,
  chatMode: PlaylistDocument['chatMode'],
  userIds: string[],
}


export const parseIdsCsv = async (fileName: string): Promise<PlaylistIdsConfig[]> => {
  const contents = await fs.readFile(fileName, 'utf-8')
  const lines = contents
    .split(/\r\n|\n/)
    .map(line => line.split('#')[0]) // ignore anything after # (comment)
    .filter(line => line !== '') // filter empty lines
  
  return lines.map(line => {
    const fields = line.split(',')
    
    return {
      playlistId: fields[0],
      chatMode: parseChatMode(fields[1]),
      // rest of the fields are user ids; ignore empty strings/trailing commas.
      // userIds can be empty
      userIds: fields.slice(2).filter(field => field !== ''),
    }
  })
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

