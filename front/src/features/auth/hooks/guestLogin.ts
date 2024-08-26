import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GUEST_SIGN_IN } from '../../../urls/index';

interface UseGuestLoginReturn {
  handleGuestLogin: () => Promise<void>;
  error: string | null;
}

const useGuestLogin = (): UseGuestLoginReturn => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGuestLogin = async (): Promise<void> => {
    setError('');

    try {
      const response = await fetch(GUEST_SIGN_IN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const accessToken = response.headers.get('access-token');
        const client = response.headers.get('client');
        const uid = response.headers.get('uid');
        console.log('Access Token:', accessToken);
        console.log('Client:', client);
        console.log('UID:', uid);

        if (accessToken !== null && client !== null && uid !== null) {
          localStorage.setItem('access-token', accessToken);
          localStorage.setItem('client', client);
          localStorage.setItem('uid', uid);
        }

        navigate('/dashboard');
      } else {
        setError('Guest login failed.');
      }
    } catch (error) {
      setError('Something went wrong with guest login. Please try again.');
    }
  };

  return { handleGuestLogin, error };
};

export default useGuestLogin;
