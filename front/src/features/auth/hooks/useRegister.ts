import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_REGISTER, FRONTEND_URL } from 'urls';

interface UseRegisterReturn {
  handleRegister: (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  error: string | undefined;
  isLoading: boolean;
}

interface ErrorData {
  message?: string;
}

const useRegister = (): UseRegisterReturn => {
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(USER_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          confirm_success_url: `${FRONTEND_URL}/login`,
        }),
      });

      if (response.ok) {
        navigate('/checkemail');
      } else {
        const errorData = (await response.json()) as ErrorData;
        setError(
          errorData.message ?? '登録に失敗しました。もう一度お試しください。',
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleRegister,
    error,
    isLoading,
  };
};

export default useRegister;
