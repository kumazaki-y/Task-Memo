import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseSendEmailReturn {
  email: string;
  setEmail: (email: string) => void;
  sendEmail: (
    url: string,
    body: object,
    redirectPath?: string,
  ) => Promise<Response>;
  error: string | null;
  isLoading: boolean;
}

// APIからのエラーレスポンス専用の型
interface ErrorResponse {
  error?: string; // エラーメッセージがオプションで含まれる
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
        credentials: 'include',
      });

      if (response.ok) {
        if (redirectPath !== undefined && redirectPath !== null) {
          navigate(redirectPath);
        }
      } else {
        const errorData = (await response.json()) as ErrorResponse;
        setError(errorData.error ?? 'メールの送信に失敗しました。');
      }

      return response;
    } catch (error) {
      setError('ネットワークエラーが発生しました。もう一度お試しください。');
      throw error;
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
