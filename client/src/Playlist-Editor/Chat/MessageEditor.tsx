
import React, { useState, useContext, CSSProperties } from 'react'
import { classes, colors } from '../../styles'
import { faPaperPlane, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { State } from '../modificationReducer'
import { playlistContext } from '../playlistContext'
import { useHover } from '../../useHover'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from 'react-router-dom'
import { SituatedChatEvent } from '../../shared/dbTypes'
import { SongActionConfirm, createSubmitHandler } from './SongActionConfirm'


const messageEditorStyle = {
  ...classes.column,
  // margin: '1.0rem 1.5rem',
  border: 'none',
  borderRadius: '2.25rem',
  // background: colors.grayscale.darkerWhite,
  // height: '4.5rem',
}
const inputStyle: CSSProperties = {
  ...classes.text,
  background: colors.grayscale.white,
  color: colors.grayscale.black,
  border: 'none',
  borderRadius: '2.25rem',
  fontSize: '1.6rem',
  padding: '1.0rem 1.5rem',
  flex: 1,
  resize: 'none',
} as const
const submitStyle = {
  ...classes.text,
  ...classes.button,
  color: colors.grayscale.black,
  height: '3.8rem',
  width: '3.8rem',
  padding: '0.7rem',
  margin: 'auto 0.5rem',
  borderRadius: '50%',
}
const submitIconStyle: CSSProperties = {
  ...classes.text,
  display: 'inline-block',
  verticalAlign: 'middle',
  height: '2.4rem',
  width: '2.4rem',
  // padding: '0.7rem',
}


type UserAction = State['userAction']


const iconOfAction = (action: UserAction) =>
  action === 'add'
  ? faPlusCircle
  : action === 'remove'
  ? faMinusCircle
  : faPaperPlane

const modificationApiUrl = (
  action: UserAction,
  playlistId: string,
  trackId: string
) =>
  action === 'add'
  ? `/api/playlists/${playlistId}/tracks/`
  : action === 'remove'
  ? `/api/playlists/${playlistId}/tracks/${trackId}/removed/`
  : `/api/playlists/${playlistId}/tracks/${trackId}/chat/`

const modificationApiMethod = (action: UserAction) =>
  action === 'remove'
  ? 'PUT'
  : 'POST'





export const SituatedMessageEditor = ({
  action,
  trackId,
}: {
  action: UserAction, //'add' | 'remove' | 'view'
  trackId: string,
}) => {
  const [message, setMessage] = useState('')
  
  const { dispatch, loadPlaylist } = useContext(playlistContext)
  
  const { id: playlistId } = useParams()
  
  type SubmitBody = SituatedChatEvent | any // TODO fix
  const submitBody: SubmitBody = { message } // TODO use API type
  if (action === 'add') {
    submitBody.trackId = trackId
  }
  
  const onSuccess = () => {
    dispatch({
      type: action === "add" ? 'submit-add' : 'submit-remove',
      payload: {
        id: trackId,
        message,
      }
    })
    loadPlaylist()
  }
  
  const submitHandler = createSubmitHandler(
    modificationApiMethod(action),
    modificationApiUrl(action, playlistId, trackId),
    submitBody,
    onSuccess
  )
  
  // const [submitHovered, submitHoverProps] = useHover()
  
  // const submitStyleDynamic = {
  //   ...submitStyle,
  //   background: colors.translucentBlack(submitHovered ? 0.2 : 0),
  // }
  
  const icon = iconOfAction(action)
  
  const submitText = action === 'add'
    ? 'Add'
    : action === 'remove'
    ? 'Remove'
    : 'Post' // send? submit? comment?
  
  const placeholderText = action === 'add'
    ? 'Explain why you want to add this track... (optional)'
    : action === 'remove'
    ? 'Explain why you want to remove this track... (optional)'
    : 'Comment on this track...'
  
  return <>
    <form
      style={messageEditorStyle}
      onSubmit={submitHandler}
    >
      <textarea
        // type="text"
        style={inputStyle}
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder={placeholderText}
      />
      {/* <button
        type="submit"
        style={submitStyleDynamic}
        {...submitHoverProps}
      >
        {submitText}
        <FontAwesomeIcon
          icon={icon}
          style={classes.icon}
        />
      </button> */}
      <SongActionConfirm
        confirmChildren={<>
          {submitText}{' '}
          <div style={submitIconStyle}>
            <FontAwesomeIcon
              icon={icon}
              style={classes.icon}
            />
          </div>
        </>}
        onCancel={() => {
          dispatch({
            type: 'cancel',
          })
        }}
      />
    </form>
  </>
}




export const SeparateMessageEditor = ({
  reloadPlaylist,
}: {
  reloadPlaylist: () => void,
}) => {
  const [message, setMessage] = useState('')
  
  
  // const { dispatch } = useContext(modificationReducerContext)
  
  const { id: playlistId } = useParams()
  
  const submitHandler = createSubmitHandler(
    'POST',
    `/api/playlists/${playlistId}/chat/`,
    { message },
    reloadPlaylist
  )
  
  
  const [submitHovered, submitHoverProps] = useHover()
  
  const submitStyleDynamic = {
    ...submitStyle,
    background: colors.translucentBlack(submitHovered ? 0.2 : 0),
  }
  
  return <>
    <form
      style={messageEditorStyle}
      onSubmit={submitHandler}
    >
      <textarea
        // type="text"
        style={inputStyle}
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Leave a comment..."
      />
      <button
        type="submit"
        style={submitStyleDynamic}
        {...submitHoverProps}
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          style={classes.icon}
        />
      </button>
    </form>
  </>
}





