import { type FC } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import CheckEmail from '../components/ecosystems/checkEmail';
import Dashboard from '../components/ecosystems/dashboard';
import Home from '../components/ecosystems/home';
import Login from '../components/ecosystems/loginForm';
import Register from '../components/ecosystems/registerForm';
import useProtectedRoute from '../features/auth/hooks/useProtectedRoute';

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkemail" element={<CheckEmail />} />
      <Route
        path="/dashboard"
        element={useProtectedRoute({ children: <Dashboard /> })}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
