import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_REGISTER } from 'urls';

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
        body: JSON.stringify({
          email,
          password,
          confirm_success_url: 'http://localhost:5173/login',
        }),
      });

      if (response.ok) {
        alert('確認メールを送信しました。メールを確認してください。');
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
