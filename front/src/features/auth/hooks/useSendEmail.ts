import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseSendEmailReturn {
  email: string;
  setEmail: (email: string) => void;
  sendEmail: (
    url: string,
    body: object,
    redirectPath?: string,
  ) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

export const useSendEmail = (): UseSendEmailReturn => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendEmail = async (
    url: string,
    body: object,
    redirectPath?: string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        if (redirectPath !== undefined && redirectPath !== null) {
          navigate(redirectPath);
        }
      } else {
        setError('メールの送信に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    sendEmail,
    error,
    isLoading,
  };
};
