import React from 'react'
import SignupForm  from '../forms/auth/signup.form'

const SignupView: React.FC = () => {
  const handleSubmit = () => {
    // TODO: integrate auth service
  }
  
  return (
      <SignupForm onSubmit={handleSubmit} />
  )
}

export default SignupView