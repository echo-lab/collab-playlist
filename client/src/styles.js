


export const colors = {
  grayscale: {
    black: '#191414',
    darkGray: '#303030',
    white: '#F0F0F0',
  },
  green1: '#1DB954', // 'spotify green'
  green2: '#1ED760',
  palette1: {
    
  },
}
export const classes = {
  text: {
    margin: '0',
    color: colors.grayscale.white,
    // fontFamily: 'Catamaran',
    fontFamily: 'Overpass, sans-serif',
    fontWeight: '700',
    fontSize: '1.6rem',
  },
  bold: {
    fontWeight: '900',
  },
  textOverflow: ({ lines = 1 }) => ({
    overflow: 'hidden',
    // whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lines,
  }),
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
}


