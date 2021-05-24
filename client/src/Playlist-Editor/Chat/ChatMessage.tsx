
import React, { CSSProperties, useEffect } from 'react'
import { SituatedChatEvent } from '../../shared/dbTypes'
import { classes, colors } from '../../styles'
import { useResource, fetchWrapper } from '../../fetchWrapper'
import { handleApiError } from '../../api'



const messageStyle: CSSProperties = {
  ...classes.column,
  marginBottom: '1.0rem',
}
const userNameStyle: CSSProperties = {
  ...classes.text,
  display: 'inline',
  fontWeight: 900,
}
const timestampStyle: CSSProperties = {
  ...classes.text,
  color: colors.grayscale.brightGray,
  margin: 'auto 0 auto 0.5rem',
  fontStyle: 'italic',
  fontSize: '1.2rem',
}
const actionStyle: CSSProperties = {
  ...classes.text,
  fontStyle: 'italic',
  color: colors.grayscale.lightText,
}
const messageTextStyle: CSSProperties = {
  ...classes.text,
}



export const SituatedChatMessage = ({
  chatEvent,
}: {
  chatEvent: SituatedChatEvent
}) => {
  
  console.log({chatEvent})
  
  const [
    user, userSetter
  ] = useResource<SpotifyApi.UserProfileResponse>(null, true)
  
  useEffect(() => {
    (async () => {
      const response = await fetchWrapper<SpotifyApi.UserProfileResponse>(`/api/users/${chatEvent.userId}`)
      handleApiError(response)
      userSetter({
        data: response.data,
        loading: false,
      })
    })()
  }, [chatEvent.userId, userSetter])
  
  return <div style={messageStyle}>
    <div style={classes.row}>
      <h4 style={userNameStyle}>
        { user.data
        ? user.data.display_name
        : '\xa0' // nbsp to preserve line height when loading
        }
      </h4>
      <time style={timestampStyle}>
        {new Date(chatEvent.timestamp).toLocaleString()}
      </time>
    </div>
    { chatEvent.action !== 'comment' &&
      <p style={actionStyle}>
        { chatEvent.action === 'add'
        ? 'Added this track'
        : chatEvent.action === 'remove'
        ? 'Removed this track'
        : chatEvent.action === 're-add'
        ? 'Re-added this track'
        : 'Error occurred'
        }
      </p>
    }
    { chatEvent.message &&
      <p style={messageTextStyle}>
        {chatEvent.message}
      </p>
    }
  </div>
}




