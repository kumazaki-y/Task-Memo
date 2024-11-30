import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GUEST_SIGN_IN } from '../../../urls/index';

interface UseGuestLoginReturn {
  handleGuestLogin: () => Promise<void>;
  error: string | undefined;
}

// Cookieの操作用ヘルパー関数
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; secure`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

  if (match?.[2] != null) {
    const decodedValue = decodeURIComponent(match[2]);

    return decodedValue !== '' ? decodedValue : null;
  }

  return null;
};

const useGuestLogin = (): UseGuestLoginReturn => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を追跡
  const [shouldReload, setShouldReload] = useState(false); // リロード用フラグ
  const navigate = useNavigate();

  const handleGuestLogin = async (): Promise<void> => {
    setError('');

    try {
      const response = await fetch(GUEST_SIGN_IN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const accessToken = response.headers.get('access-token');
        const client = response.headers.get('client');
        const uid = response.headers.get('uid');

        if (accessToken != null && client != null && uid != null) {
          setCookie('access-token', accessToken, 7);
          setCookie('client', client, 7);
          setCookie('uid', uid, 7);
          setShouldReload(true); // リロードフラグを立てる
        } else {
          setError('Failed to retrieve authentication tokens.');
        }
      } else {
        setError('Guest login failed.');
      }
    } catch (error) {
      setError('Something went wrong with guest login. Please try again.');
    }
  };

  useEffect(() => {
    // リロード処理
    if (shouldReload) {
      setShouldReload(false);
      window.location.reload();
    }
  }, [shouldReload]);

  useEffect(() => {
    // ログイン状態の確認後にナビゲート
    const accessToken = getCookie('access-token');
    const client = getCookie('client');
    const uid = getCookie('uid');

    if (accessToken != null && client != null && uid != null) {
      setIsLoggedIn(true);
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return { handleGuestLogin, error };
};

export default useGuestLogin;
