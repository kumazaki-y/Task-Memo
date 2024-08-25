import { useNavigate } from 'react-router-dom';
import { USER_LOGOUT } from '../../../urls/index';

const useLogout = (): (() => Promise<void>) => {
  const navigate = useNavigate();

  const logout = async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('access-token') ?? '';
      const client = localStorage.getItem('client') ?? '';
      const uid = localStorage.getItem('uid') ?? '';

      const response = await fetch(USER_LOGOUT, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'access-token': accessToken ?? '',
          client: client ?? '',
          uid: uid ?? '',
        },
      });

      if (response.ok) {
        // トークンを削除し、ログイン画面にリダイレクト
        localStorage.removeItem('access-token');
        localStorage.removeItem('client');
        localStorage.removeItem('uid');
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Something went wrong during logout', error);
    }
  };

  return logout;
};

export default useLogout;
