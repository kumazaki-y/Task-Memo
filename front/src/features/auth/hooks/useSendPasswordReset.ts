import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PASSWORD_RESET_REQUEST_URL } from 'urls';
import { FRONTEND_URL } from '../../../urls/index';
import { useSendEmail } from '../../hooks/useSendEmail';

interface UseSendPasswordResetReturn {
  handlePasswordResetRequest: (email: string) => Promise<void>;
  error: string | undefined;
  isLoading: boolean;
}

interface ErrorResponse {
  error?: string;
}

const useSendPasswordReset = (): UseSendPasswordResetReturn => {
  const { sendEmail, isLoading } = useSendEmail();
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate(); // navigate を初期化

  const handlePasswordResetRequest = async (email: string) => {
    setError(undefined);
    try {
      const body = {
        email,
        redirect_url: `${FRONTEND_URL}/reset-password`,
      };
      const response = await sendEmail(PASSWORD_RESET_REQUEST_URL, body);

      if (response.ok) {
        navigate('/checkresetemail'); // 成功時にリダイレクト
      } else {
        const errorData = (await response.json()) as ErrorResponse;
        setError(errorData.error ?? 'このメールアドレスは登録されていません。');
      }
    } catch (err) {
      setError('このメールアドレスは登録されていません。');
    }
  };

  return {
    handlePasswordResetRequest, // emailを引数に取る
    error,
    isLoading,
  };
};

export default useSendPasswordReset;
