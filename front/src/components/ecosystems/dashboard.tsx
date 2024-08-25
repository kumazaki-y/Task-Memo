import { type FC } from 'react';
import useLogout from '../../features/auth/hooks/logout';
import Button from '../atoms/button';

const Dashboard: FC = () => {
  const logout = useLogout();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard.</p>
      <Button label="Logout" onClick={logout} />
    </div>
  );
};

export default Dashboard;
