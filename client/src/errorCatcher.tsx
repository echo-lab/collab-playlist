
import { postWrapper } from './fetchWrapper'



window.addEventListener("error", (e) => {
  postWrapper('/log', {
    type: e.type,
    timestamp: e.timeStamp,
    colno: e.colno,
    // e.error is an Error, so JSON.stringify gives "{}" for it
    'error.stack': e.error.stack,
    filename: e.filename,
    lineno: e.lineno,
    message: e.message,
  }).catch(() => {}) // catch potential errors to avoid infinite loop
})
window.addEventListener('unhandledrejection', (e) => {
  postWrapper('/log', {
    type: e.type,
    timestamp: e.timeStamp,
    reason: e.reason,
    // if e.reason is an Error, the above will be "{}", so get its props:
    'reason.message': e.reason.message,
    'reason.stack': e.reason.stack,
  }).catch(() => {}) // catch potential errors to avoid infinite loop
})

export default { }


