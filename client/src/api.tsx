


import { Resource } from './fetchWrapper'


// TODO eventually put all functions and hooks like usePlaylist here...




export const errorMessages = {
  '4xx': 'Please try again. If problem persists, please logout and log back in',
  '401': 'Login error. Please logout and log back in',
  '5xx': 'There was a problem on our side. If problem persists, please try at '
    + 'a later time',
  unknown: 'Unknown error occurred',
} as const

export const handleApiError = ({ error }: Pick<Resource<unknown>, 'error'>) => {
  if (error) {
    alert(errorMessages[
        error.status === 401
      ? '401'
      : 400 <= error.status && error.status < 500
      ? '4xx'
      : 500 <= error.status && error.status < 600
      ? '5xx'
        // unknown error shouldn't be possible, but we should cover it anyway
      : 'unknown'
    ])
  }
}



