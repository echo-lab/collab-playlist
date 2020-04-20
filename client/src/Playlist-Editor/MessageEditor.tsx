
import React, { useState, useContext, FormEvent, Dispatch } from 'react'
import { classes, colors } from '../styles'
import { faPaperPlane, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { State, modificationReducerContext, Action } from './modificationReducer'
import { useHover } from '../useHover'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { postWrapper } from '../fetchWrapper'
import { useParams } from 'react-router-dom'



const messageEditorStyle = {
  ...classes.row,
  // margin: '1.0rem 1.5rem',
  border: 'none',
  borderRadius: '2.25rem',
  background: colors.grayscale.darkerWhite,
  height: '4.5rem',
}
const inputStyle = {
  ...classes.text,
  background: colors.grayscale.white,
  color: colors.grayscale.black,
  border: 'none',
  borderRadius: '2.25rem',
  fontSize: '1.6rem',
  padding: '1.0rem 1.5rem',
  flex: 1,
}
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


type UserAction = State['userAction']


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


const situatedSubmitHandler = (
  action: UserAction,
  playlistId: string,
  trackId: string,
  message: string,
  dispatch: Dispatch<Action>
) => (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  
  ;(async () => {
    console.log('submitted')
    // set loading
    const response = await postWrapper(
      modificationApiUrl(action, playlistId, trackId),
      {
        message,
        ...(action === 'add' && { trackId }),
      }
    )
    
    if (response.error) {
      alert('error, try again')
    } else {
      dispatch({
        type: action === "add" ? 'submit-add' : 'submit-remove',
        payload: {
          id: trackId,
          message,
        }
      })
    }
  })()
}



export const SituatedMessageEditor = ({
  action,
  trackId,
}: {
  action: UserAction, //'add' | 'remove' | 'view'
  trackId: string,
}) => {
  const [message, setMessage] = useState('')
  
  
  const { dispatch } = useContext(modificationReducerContext)
  
  const { id: playlistId } = useParams()
  
  const submitHandler = situatedSubmitHandler(
    action, playlistId, trackId, message, dispatch
  )
  
  
  const [submitHovered, submitHoverProps] = useHover()
  
  const submitStyleDynamic = {
    ...submitStyle,
    background: colors.translucentBlack(submitHovered ? 0.2 : 0),
  }
  
  const icon = action === 'add'
    ? faPlusCircle
    : action === 'remove'
    ? faMinusCircle
    : faPaperPlane
  
  const submitText = action === 'add'
    ? 'Add'
    : action === 'remove'
    ? 'Remove'
    : 'Post' // send? submit? comment?
  
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
      />
      <button
        type="submit"
        style={submitStyleDynamic}
        {...submitHoverProps}
      >
        {submitText}
        <FontAwesomeIcon
          icon={icon}
          style={classes.icon}
        />
      </button>
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
  
  // const [postResource, postResourceSetter] = useResource(null)
  
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    ;(async () => {
      console.log('submitted')
      // set loading
      const response = await postWrapper(
        `/api/playlists/${playlistId}/chat/`,
        { message }
      )
      
      if (response.error) {
        alert('error, try again')
      } else {
        reloadPlaylist()
      }
    })()
  }
  
  
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





