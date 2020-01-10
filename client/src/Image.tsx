
import React, { CSSProperties } from 'react'




/**
 * clips image to given size without changing aspect ratio scaling. Only works
 * if image size determines container size. (must give width and height,
 * flexBasis, etc)
 */
export const Image = ({
  src, alt, style
}:{
  src: string,
  alt: string,
  style: {
    width: number | string,
    height: number | string,
  },
}) => {
  const imageStyle: CSSProperties = {
    ...style,
    objectPosition: 'center',
    // Make the image cover the area of the <img>, and clip the excess
    objectFit: 'cover',
  }
  return <img src={src} style={imageStyle} alt={alt} />
}


