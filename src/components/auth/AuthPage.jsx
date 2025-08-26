import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import HomeLink from '../HomeLink.jsx'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  const switchToRegister = () => setIsLogin(false)
  const switchToLogin = () => setIsLogin(true)

  return (
    <div className="auth-page">
      <HomeLink />
      {isLogin ? (
        <Login onSwitchToRegister={switchToRegister} />
      ) : (
        <Register onSwitchToLogin={switchToLogin} />
      )}
    </div>
  )
}

export default AuthPage
