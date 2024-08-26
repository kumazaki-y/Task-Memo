import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_REGISTER } from 'urls';

interface RegisterResponse {
  'access-token': string;
  client: string;
  uid: string;
}

interface UseRegisterReturn {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  handleRegister: () => Promise<void>;
  error: string | null;
}

const useRegister = (): UseRegisterReturn => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');

      return;
    }

    try {
      const response = await fetch(USER_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as RegisterResponse;

      if (response.ok) {
        localStorage.setItem('access-token', data['access-token']);
        localStorage.setItem('client', data.client);
        localStorage.setItem('uid', data.uid);
        navigate('/login');
      } else {
        setError('Registration failed. Please try again.');
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
    confirmPassword,
    setConfirmPassword,
    error,
    handleRegister,
  };
};

export default useRegister;
