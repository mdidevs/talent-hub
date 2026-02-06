import React from 'react'
import ResetPasswordForm from '../forms/auth/resetPassword.form'

const ResetPasswordView: React.FC = () => {
  const handleSubmit = () => {
    // TODO: integrate auth service
  }

  return (
      <ResetPasswordForm onSubmit={handleSubmit} />
  )
}

export default ResetPasswordView
