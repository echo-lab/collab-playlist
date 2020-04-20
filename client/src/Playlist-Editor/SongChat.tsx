
import React from 'react'
import { classes } from '../styles'
import * as styles from './playlistTableRowStyles'
import { State } from './modificationReducer'
import { SituatedMessageEditor } from './MessageEditor'


const chatStyle = {
  ...classes.column,
  flex: 1,
  margin: '0 1.0rem 1.0rem',
}


export const SituatedChat = ({
  action,
  id,
}: {
  action: State['userAction'], //'add' | 'remove' | 'view'
  id: string,
}) => {
  

  
  return <div style={classes.row}>
    <div style={styles.expandCollapseButtonStyle}>
      {/* Just a spacer */}
    </div>
    <div style={chatStyle}>
      <div>
        {/* TODO chat history */}
      </div>
      <SituatedMessageEditor action={action} trackId={id} />
    </div>
    <div style={styles.expandCollapseButtonStyle}>
      {/* Just a spacer */}
    </div>
  </div>
}


// const messageEditorStyle = {
//   ...classes.row,
//   // margin: '1.0rem 1.5rem',
//   border: 'none',
//   borderRadius: '2.25rem',
//   background: colors.grayscale.darkerWhite,
//   height: '4.5rem',
// }
// const inputStyle = {
//   ...classes.text,
//   background: colors.grayscale.white,
//   color: colors.grayscale.black,
//   border: 'none',
//   borderRadius: '2.25rem',
//   fontSize: '1.6rem',
//   padding: '1.0rem 1.5rem',
//   flex: 1,
// }
// const submitStyle = {
//   ...classes.text,
//   ...classes.button,
//   color: colors.grayscale.black,
//   height: '3.8rem',
//   width: '3.8rem',
//   padding: '0.7rem',
//   margin: 'auto 0.5rem',
//   borderRadius: '50%',
// }

// const MessageEditor = ({
//   action,
//   id: songId,
// }: {
//   action: State['userAction'], //'add' | 'remove' | 'view'
//   id: string,
// }) => {
  
//   const [message, setMessage] = useState('')
  
  
//   const { dispatch } = useContext(modificationReducerContext)
  
//   const { id: playlistId } = useParams()
  
//   // const [postResource, postResourceSetter] = useResource(null)
  
//   const submitHandler = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
    
//     ;(async () => {
//       console.log('submitted')
//       // set loading
//       const response = await postWrapper(
//         `/api/playlists/${playlistId}/tracks/${songId}/chat/`,
//         {
//           message,
//         }
//       )
      
//       if (response.error) {
//         alert('error, try again')
//       } else {
//         dispatch({
//           type: action === "add" ? 'submit-add' : 'submit-remove',
//           payload: {
//             id: songId,
//             message,
//           }
//         })
//       }
//     })()
//   }
  
  
//   const [submitHovered, submitHoverProps] = useHover()
  
//   const submitStyleDynamic = {
//     ...submitStyle,
//     background: colors.translucentBlack(submitHovered ? 0.2 : 0),
//   }
  
//   return <>
//     <form
//       style={messageEditorStyle}
//       onSubmit={submitHandler}
//     >
//       <input
//         type="text"
//         style={inputStyle}
//         value={message}
//         onChange={e => setMessage(e.target.value)}
//       />
//       <button
//         type="submit"
//         style={submitStyleDynamic}
//         {...submitHoverProps}
//       >
//         <FontAwesomeIcon
//           icon={
//             action === 'add'
//             ? faPlusCircle
//             : action === 'remove'
//             ? faMinusCircle
//             : faPaperPlane
//           }
//           style={classes.icon}
//         />
//       </button>
//     </form>
//   </>
// }


