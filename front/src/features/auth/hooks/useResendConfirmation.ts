import { useState } from 'react';
import { CONFIRMATION_RESEND_URL } from 'urls';

interface UseResendConfirmationReturn {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  handleResend: () => Promise<void>;
  resendMessage: string | undefined;
  isLoading: boolean;
}

const useResendConfirmation = (): UseResendConfirmationReturn => {
  const [email, setEmail] = useState('');
  const [resendMessage, setResendMessage] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    setIsLoading(true);
    setResendMessage(undefined);

    try {
      const response = await fetch(CONFIRMATION_RESEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendMessage('確認メールが再送信されました。');
      } else {
        const errorData = (await response.json()) as { error?: string };
        setResendMessage(errorData.error ?? '再送信に失敗しました。');
      }
    } catch (err) {
      setResendMessage('再送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    handleResend,
    resendMessage,
    isLoading,
  };
};

export default useResendConfirmation;
