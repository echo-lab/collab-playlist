
import { createContext, Dispatch, SetStateAction } from 'react'
import { Resource } from './fetchWrapper'



// ! currently not used in the app


// const userCache: Record<string, Resource<SpotifyApi.UserObjectPublic>> = { }

export type UserCache = Record<string, Resource<SpotifyApi.UserObjectPublic>>
export type UserCacheContext = {
  userCache?: UserCache,
  setUserCache?: Dispatch<SetStateAction<UserCache>>
}

export const userCacheContext = createContext<UserCacheContext>({ })


