import { useNavigate } from 'react-router-dom';
import { USER_LOGOUT } from '../../../urls/index';

// Cookie操作用のヘルパー関数
const getCookie = (name: string): string | null => {
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

  if (match?.[2] != null) {
    const decodedValue = decodeURIComponent(match[2]);

    return decodedValue !== '' ? decodedValue : null;
  }

  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/`;
};

const useLogout = (): (() => Promise<void>) => {
  const navigate = useNavigate();

  const logout = async (): Promise<void> => {
    try {
      const accessToken = getCookie('access-token') ?? '';
      const client = getCookie('client') ?? '';
      const uid = getCookie('uid') ?? '';

      const response = await fetch(USER_LOGOUT, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'access-token': accessToken,
          client,
          uid,
        },
      });

      if (response.ok) {
        // Cookieからトークンを削除し、ログイン画面にリダイレクト
        deleteCookie('access-token');
        deleteCookie('client');
        deleteCookie('uid');
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
