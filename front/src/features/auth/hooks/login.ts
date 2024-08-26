import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_LOGIN } from 'urls';

interface UseLoginReturn {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: () => Promise<void>;
  error: string | null;
}

const useLogin = (): UseLoginReturn => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
        setError('Invalid email or password.');
      }
    } catch (error: unknown) {
      setError('Something went wrong. Please try again.');
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
