
import { Navigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { loginState } from '../atom/atom.js'



const protectedRoute = ({children}) => {
  const auth = useAtomValue(loginState)

    return ( auth.isLogin ? children : <Navigate to = '/login' replace />)
}

export default protectedRoute;