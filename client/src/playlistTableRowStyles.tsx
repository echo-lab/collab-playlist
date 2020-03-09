
import { CSSProperties } from 'react'
import { classes, colors } from './styles'





const fontSize = '1.8rem'
export const rowStyle = {
  ...classes.row,
  height: '5.0rem',
  // ...(songIsHovered && { background: colors.translucentWhite(0.1) }),
}
const childMargin = 'auto 2.0rem'

const childText: CSSProperties = {
  ...classes.text,
  ...classes.textOverflow(),
  fontSize,
}
export const expandCollapseButtonStyle = {
  margin: 'auto 2.0rem',
  width: '2.4rem',
  height: '2.4rem',
  padding: '0.7rem',
  borderRadius: '0.3rem',
  color: colors.grayscale.white,
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
export const removeButtonStyle = {
  margin: 'auto 2.0rem',
  width: '2.4rem',
  height: '2.4rem',
  padding: '0.7rem',
  borderRadius: '0.3rem',
  color: colors.grayscale.white,
}





