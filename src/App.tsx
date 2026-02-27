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
import ProtectedRoute from '@/components/route/ProtectedRoute'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<BasicLayout />}>
            {/* <Route path="/" element={<LoginPage />} /> */}
          </Route>
          <Route element={<ProtectedRoute redirectIfAuthenticated={'/plan'}><AuthLayout /></ProtectedRoute>}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/new-password" element={<NewPasswordPage />} />
          </Route>
          <Route element={<ProtectedRoute><OrderWizardLayout /></ProtectedRoute>}>
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/seat" element={<SeatPage />} />
            <Route path="/review" element={<ReviewOrderPage />} />
            <Route path="/agreement" element={<AgreementPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={''} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
