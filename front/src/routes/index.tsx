import { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from '..//components/ecosystems/register';
import Dashboard from '../components/ecosystems/dashboard';
import Home from '../components/ecosystems/home';
import Login from '../components/ecosystems/login';

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
