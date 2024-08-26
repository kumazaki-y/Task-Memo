import { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../components/ecosystems/dashboard';
import Home from '../components/ecosystems/home';
import Login from '../components/ecosystems/loginForm';
import Register from '../components/ecosystems/registerForm';

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;
