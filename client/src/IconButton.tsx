
import React, { HTMLAttributes } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'


interface IconButtonProps extends HTMLAttributes<HTMLElement> {
  icon: IconDefinition,
}

export const IconButton = ({ icon, onClick, style, ...rest }: IconButtonProps) => {
  const buttonStyle = {
    // these styles only neutralize browser styles:
    background: 'transparent',
    border: 'none',
    padding: 0,
    // you specify the rest of the styles
    ...style,
  }
  const iconStyle = {
    // take up the size of the button contents
    width: '100%',
    height: '100%',
  }
  return <button style={buttonStyle} onClick={onClick} {...rest}>
    <FontAwesomeIcon icon={icon} style={iconStyle} />
  </button>
}



