
import NodeCache from 'node-cache'


/**
 * cache that maps session accessToken to userId
 * i.e. get(accessToken) => userId
 */
export const accessTokenCache = new NodeCache({
  stdTTL: 60 * 60, // 1 hour in seconds
  useClones: false, // don't clone data, better for perf; be careful with references
})



// for a bidirectional map: (not using ttl feature)
// stores refreshToken -> userId
const refreshTokenToUserId = new NodeCache({ useClones: false })
// stores userId -> refreshToken
const userIdToRefreshToken = new NodeCache({ useClones: false })


// wrapper for bimap functionality
export const refreshTokenCache = {
  
  // returns userId from given refreshToken or undefined if not found
  // error if argument is undefined
  getIdFromToken(refreshToken: string) {
    return refreshTokenToUserId.get<string>(refreshToken)
  },
  
  // returns refreshToken from given userId or undefined if not found
  // error if argument is undefined
  getTokenFromId(userId: string) {
    return userIdToRefreshToken.get<string>(userId)
  },
  
  // set refreshToken, userId pair
  set(refreshToken: string, userId: string) {
    refreshTokenToUserId.set(refreshToken, userId)
    userIdToRefreshToken.set(userId, refreshToken)
  },
  
  // deletes both maps' entries from given userId
  // graceful no-op if userId not in map
  deleteByUserId(userId) {
    // get then delete:
    const refreshToken = userIdToRefreshToken.take<string>(userId)
    // refreshToken undefined if userId not found
    // cannot get or del undefined key, so we do a check
    if (refreshToken != undefined) {
      refreshTokenToUserId.del(refreshToken)
    }
  },
  
  // deletes both maps' entries from given refresh token
  // graceful no-op if refreshToken not in map
  deleteByToken(refreshToken) {
    // get then delete:
    const userId = refreshTokenToUserId.take<string>(refreshToken)
    // userId undefined if refreshToken not found
    // cannot get or del undefined key, so we do a check
    if (userId != undefined) {
      userIdToRefreshToken.del(userId)
    }
  },
}





