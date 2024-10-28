import { type FC } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import CheckEmail from '../components/ecosystems/checkEmail';
import CheckResetEmail from '../components/ecosystems/checkResetEmail';
import Dashboard from '../components/ecosystems/dashboard';
import Home from '../components/ecosystems/home';
import Login from '../components/ecosystems/loginForm';
import ResetPasswordComplete from '../components/ecosystems/passwordResetComplete';
import Register from '../components/ecosystems/registerForm';
import ResendConfirmationForm from '../components/ecosystems/resendConfirmationForm';
import ResetPasswordForm from '../components/ecosystems/resetPasswordForm';
import SendResetPasswordMail from '../components/ecosystems/sendPasswordResetFrom';
import useProtectedRoute from '../features/auth/hooks/useProtectedRoute';

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkemail" element={<CheckEmail />} />
      <Route path="/checkresetemail" element={<CheckResetEmail />} />
      <Route path="/resendemail" element={<ResendConfirmationForm />} />
      <Route path="/password" element={<SendResetPasswordMail />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route
        path="/reset-password-complete"
        element={<ResetPasswordComplete />}
      />
      <Route
        path="/dashboard"
        element={useProtectedRoute({ children: <Dashboard /> })}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
