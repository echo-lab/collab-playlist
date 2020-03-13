
import { CSSProperties } from 'react'
import { classes, colors } from '../styles'





const fontSize = '1.8rem'
export const rowStyle = {
  ...classes.row,
  height: '5.0rem',
  // ...(songIsHovered && { background: colors.translucentWhite(0.1) }),
}
const childMargin = 'auto 1.0rem'

const childText: CSSProperties = {
  ...classes.text,
  ...classes.textOverflow(),
  fontSize,
}
export const expandCollapseButtonStyle = {
  margin: childMargin,
  width: '2.4rem',
  height: '2.4rem',
  padding: '0.7rem',
  borderRadius: '0.3rem',
  color: colors.grayscale.white,
  // background: 'gray',
}
export const titleStyle: CSSProperties = {
  ...childText,
  margin: childMargin,
  flex: 2, //tableFlexValues.title,
}
export const artistStyle: CSSProperties = {
  ...childText,
  margin: childMargin,
  flex: 1, //tableFlexValues.artist,
}
export const albumStyle: CSSProperties = {
  ...childText,
  margin: childMargin,
  flex: 1, //tableFlexValues.album,
}
export const addedByStyle: CSSProperties = {
  ...childText,
  margin: childMargin,
  flex: 1, //tableFlexValues.addedBy,
}
// the right button is for
// 1) selecting for removal or for
// 2) cancelling a removal/addition
export const rightButtonWrapperStyle = {
  ...classes.row, // needed to center the button vertically because of the additional td wrapper
  margin: childMargin,
  width: '3.8rem',
  height: '3.8rem',
}
export const rightButtonStyle = {
  padding: '0.7rem',
  borderRadius: '0.3rem',
  color: colors.grayscale.white,
} as const





