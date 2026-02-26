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
import OrderWizardLayout from './layouts/order.layout'
import TeamPage from './pages/order/wizard/team.page'
import SeatPage from './pages/order/wizard/seat.page'
import ReviewOrderPage from './pages/order/wizard/review.page'
import AgreementPage from './pages/order/wizard/agreement.page'
import CheckoutPage from './pages/order/wizard/checkout.page'
import { ThemeProvider } from './styles/theme-provider'
import PlanPage from './pages/order/wizard/plan.page'
import Setup from './pages/dashboard/setup.page'
import Overview from './pages/dashboard/overview.page'
import Orders from './pages/dashboard/orders/orders.page'
import OrderDetails from './pages/dashboard/orders/orderDetails.page'
import Settings from './pages/dashboard/settings/settings.page'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
          <Route element={<OrderWizardLayout />}>
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/seat" element={<SeatPage />} />
            <Route path="/review" element={<ReviewOrderPage />} />
            <Route path="/agreement" element={<AgreementPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/setup" element={<Setup/>} />
            <Route path="/overview" element={<Overview/>} />
            <Route path="/orders" element={<Orders/>} />
            <Route path='/orders/details' element={<OrderDetails/>}/>
            <Route path="/settings" element={<Settings/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
