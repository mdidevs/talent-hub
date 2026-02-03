import React from 'react'
import LoginForm from './forms/auth/login.form'

const LoginView: React.FC = () => {
  const handleSubmit = () => {
    // TODO: integrate auth service
  }

  return (
      <LoginForm onSubmit={handleSubmit} />
  )
}

export default LoginView
