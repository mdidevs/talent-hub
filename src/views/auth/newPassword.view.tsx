import React from 'react'
import NewPasswordForm from '../forms/auth/newPassword.form'

const NewPasswordView: React.FC = () => {
  const handleSubmit = () => {
    // TODO: integrate auth service
  }

  return (
      <NewPasswordForm onSubmit={handleSubmit} />
  )
}

export default NewPasswordView
