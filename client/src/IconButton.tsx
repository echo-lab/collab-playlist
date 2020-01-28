
import React, { CSSProperties } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'


export const IconButton = ({ icon, onClick, style }: { icon: IconDefinition, onClick?: () => void, style?: CSSProperties }) => {
  const buttonStyle = {
    // these styles only neutralize browser styles:
    background: 'transparent',
    border: 'none',
    padding: 0,
    // you specify the rest of the styles
    ...style,
  }
  const iconStyle = {
    width: '100%',
    height: '100%',
  }
  return <button style={buttonStyle} onClick={onClick}>
    <FontAwesomeIcon icon={icon} style={iconStyle} />
  </button>
}



