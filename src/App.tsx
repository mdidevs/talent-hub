// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BasicLayout from './layouts/basic.layout'
import { MainLayout } from './layouts/main.layout'
import LoginPage from './pages/auth/login.page'
import AuthLayout from './layouts/auth.layout'
import SignupPage from './pages/auth/signup.page'
import ResetPasswordPage from './pages/auth/resetPassword.page'
import NewPasswordPage from './pages/auth/newPassword.page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BasicLayout />}>
          <Route path="/" element={''} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={''} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
