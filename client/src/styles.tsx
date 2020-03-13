


/**
 * use of `as const` means these objects are deeply immutable and allows
 * typescript to statically check their values to be compliant with some
 * CSSProperties that accept only certain string literals
 */

export const colors = {
  grayscale: {
    black: '#101010',
    darkerGray: '#202020',
    darkGray: '#2A2A2A',
    gray: '#3A3A3A',
    lightGray: '#606060',
    brightGray: '#A0A0A0',
    lightText: '#B0B0B0',
    darkerWhite: '#B8B8B8',
    darkWhite: '#D0D0D0',
    white: '#F0F0F0',
  },
  translucentWhite: opacity => `rgba(255,255,255,${opacity})`,
  translucentBlack: opacity => `rgba(0,0,0,${opacity})`,
  green1: '#1DB954', // 'spotify green'
  green2: '#1ED760',
  palette1: {
    
  },
} as const

export const classes = {
  // relatively reusable/generic styles:
  text: {
    margin: '0',
    color: colors.grayscale.white,
    // fontFamily: 'Catamaran',
    fontFamily: 'Overpass, sans-serif',
    fontWeight: 700,
    fontSize: '1.6rem',
  },
  bold: {
    fontWeight: 900,
  },
  textOverflow: ({ lines = 1 } = {}) => ({
    overflow: 'hidden',
    // whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lines,
  } as const),
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  visible: {
    visibility: 'visible',
  },
  hidden: {
    visibility: 'hidden',
  },
  centeredClippedImage: {
    objectPosition: 'center',
    // Make the image cover the area of the <img>, and clip the excess
    objectFit: 'cover',
  }
} as const


