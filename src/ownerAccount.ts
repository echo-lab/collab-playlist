
import SpotifyWebApi from 'spotify-web-api-node'



console.log(process.env.OWNER_ACCOUNT_ID)
console.log(process.env.OWNER_ACCOUNT_REFRESH_TOKEN)

const {
  CLIENT_ID,
  CLIENT_SECRET,
  OWNER_ACCOUNT_ID,
  OWNER_ACCOUNT_REFRESH_TOKEN,
} = process.env

if (!OWNER_ACCOUNT_ID || !OWNER_ACCOUNT_REFRESH_TOKEN) {
  throw new Error('Provide Owner account id and refresh token in .env')
}


// spotify api wrapper used for accessing playlists through the owner account
export const spotifyApi = new SpotifyWebApi({
  refreshToken: OWNER_ACCOUNT_REFRESH_TOKEN,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
})


export const refreshAccessToken = async () => {
  try {
    const data = await spotifyApi.refreshAccessToken()
    // set access token for future requests
    spotifyApi.setAccessToken(data.body.access_token)
    
  } catch (e) {
    console.error({e})
  }  
}


// refresh the access token regularly
setInterval(refreshAccessToken, 1000 * 60 * 30) // every 30 minutes





