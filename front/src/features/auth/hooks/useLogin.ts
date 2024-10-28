import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_LOGIN } from 'urls';

interface UserData {
  data: {
    confirmed_at: string | undefined;
    email: string;
    id: number;
    image: string | undefined;
    name: string | undefined;
    nickname: string | undefined;
    password: string | undefined;
    provider: string;
    uid: string;
  };
}

interface ErrorData {
  message?: string;
}

interface UseLoginReturn {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (data: { email: string; password: string }) => Promise<void>;
  error: string | undefined;
}

// Cookieに保存するヘルパー関数
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; secure`;
};

// cookieから値を取得するヘルパー関数
const getCookie = (name: string): string | null => {
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

  if (match?.[2] != null) {
    const decodedValue = decodeURIComponent(match[2]);

    return decodedValue !== '' ? decodedValue : null;
  }

  return null;
};

// Cookieを削除するヘルパー関数
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/`;
};

const useLogin = (): UseLoginReturn => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const [shouldReload, setShouldReload] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setError('');

    try {
      // 古い認証情報やリダイレクトURLをクリア
      deleteCookie('reset_password_token');
      deleteCookie('redirect_url');

      const response = await fetch(USER_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userData = (await response.json()) as UserData;

        if (
          userData.data.confirmed_at === null ||
          userData.data.confirmed_at === ''
        ) {
          setError(
            'あなたのアカウントはまだ認証されていません。メールをご確認ください。',
          );

          return;
        }

        const accessToken = response.headers.get('access-token');
        const client = response.headers.get('client');
        const uid = response.headers.get('uid');

        if (accessToken != null && client != null && uid != null) {
          setCookie('access-token', accessToken, 7); // 7日は適宜変更
          setCookie('client', client, 7);
          setCookie('uid', uid, 7);
        }

        setShouldReload(true);
      } else {
        const errorData = (await response.json()) as ErrorData;
        setError(errorData.message ?? 'エラーが発生しました。');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  // ログイン完了時にナビゲーションするための useEffect
  useEffect(() => {
    if (shouldReload) {
      setShouldReload(false);
      window.location.reload(); // リロードを実行
    }
  }, [shouldReload]);

  useEffect(() => {
    const accessToken = getCookie('access-token');
    const client = getCookie('client');
    const uid = getCookie('uid');

    if (accessToken != null && client != null && uid != null) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin,
  };
};

export default useLogin;
