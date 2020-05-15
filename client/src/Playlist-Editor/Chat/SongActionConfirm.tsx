
import React, { FormEvent, CSSProperties, ReactNode } from 'react'
import { postWrapper } from '../../fetchWrapper'
import { classes, colors } from '../../styles';
import { useHover } from '../../useHover';


export const createSubmitHandler = (
  method: string,
  url: string,
  body: Record<string, any>,
  onSuccess: () => void,
) => (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  
  ;(async () => {
    console.log('submitted')
    // set loading
    const response = await postWrapper(
      url,
      body,
      { method }
    )
    
    if (response.error) {
      alert('error, try again')
    } else {
      onSuccess()
    }
  })()
}





const rowStyle: CSSProperties = {
  ...classes.row,
  margin: '0.5rem',
}
const bothButtonsStyle: CSSProperties = {
  ...classes.text,
  ...classes.button,
  borderRadius: '0.5rem',
  flex: 1,
  margin: '0.5rem',
  padding: '1.0rem',
}
const cancelStyle: CSSProperties = {
  ...bothButtonsStyle,
}
const submitStyle: CSSProperties = {
  ...bothButtonsStyle,
}


export const SongActionConfirm = ({
  // onConfirm,
  confirmChildren,
  onCancel,
}: {
  // onConfirm?: (e: FormEvent<HTMLFormElement>) => void,
  confirmChildren: ReactNode,
  onCancel: () => void,
}) => {
  
  const [cancelHovered, cancelHoverProps] = useHover()
  
  const cancelStyleDynamic = {
    ...cancelStyle,
    background: colors.translucentWhite(cancelHovered ? 0.2 : 0),
    border: `0.3rem solid ${colors.translucentWhite(cancelHovered ? 0 : 0.2)}`,
  }
  
  const [submitHovered, submitHoverProps] = useHover()
  
  const submitStyleDynamic = {
    ...submitStyle,
    background: submitHovered ? '#e81717' : '#a61111',
  }
  
  return <div style={rowStyle}>
    <button
      type="button"
      style={cancelStyleDynamic}
      {...cancelHoverProps}
      onClick={onCancel}
    >
      Cancel
      {/* <FontAwesomeIcon
        icon={icon}
        style={classes.icon}
      /> */}
    </button>
    <button
      type="submit"
      style={submitStyleDynamic}
      {...submitHoverProps}
    >
      {/* {submitText}
      <FontAwesomeIcon
        icon={icon}
        style={classes.icon}
      /> */}
      { confirmChildren }
    </button>
  </div>
}



