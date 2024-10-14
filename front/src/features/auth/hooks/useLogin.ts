import { useState } from 'react';
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
  handleLogin: (event: React.FormEvent) => Promise<void>;
  error: string | undefined;
}

const useLogin = (): UseLoginReturn => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(USER_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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

        if (accessToken !== null && client !== null && uid !== null) {
          localStorage.setItem('access-token', accessToken);
          localStorage.setItem('client', client);
          localStorage.setItem('uid', uid);
        }

        navigate('/dashboard');
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
