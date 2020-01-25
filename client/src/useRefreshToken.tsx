
import { useResource, apiWrapper } from './api-hooks'


// TODO refactor
// export const useRefreshToken = (isLoggedIn, logout) => {
//   const [resource, setter] = useResource<{ expires_in: number }>()
  
//   useEffect(() => {
//     if (!isLoggedIn) return
    
//     const refresh = () => apiWrapper('/api/refresh_token', setter, { cache: 'no-store' })
    
//     setTimeout(refresh, 1000 * 10)
    
//     // const refresh = async () => {
//     //   try {
//     //     const response = await fetch('/api/refresh_token')
//     //     if (!response.ok) {
//     //       throw response.status
//     //     }
//     //     const { expires_in } = await response.json() // number of seconds to expiration
//     //     console.log({expires_in})
//     //     setTimeout(refresh, expires_in * 1000 * 0.9) // anticipate expiration by a little
//     //   } catch (e) {
//     //     console.error({e})
//     //     if (400 <= e && e < 500) {
//     //       // client error, tell user to re-authenticate
//     //       // alert('please login again')
//     //       logout()
//     //     } else if (500 <= e && e < 600) {
//     //       // server error, retry
//     //       setTimeout(refresh, 1000 * 10)
//     //     }
//     //   }
//     // }
//     // setTimeout(refresh, 1000 * 10)
//   }, [isLoggedIn, logout])
  
//   useEffect(() => {
//     if (resource.data.expires_in) {
//       console.log({expires_in: resource.data.expires_in})
//       setTimeout(refresh, expires_in * 1000 * 0.9) // anticipate expiration by a little
//     }
//   }, [resource.data])
// }


