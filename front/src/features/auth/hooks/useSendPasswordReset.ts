import { useState } from 'react';
import { PASSWORD_RESET_REQUEST_URL } from 'urls';
import { FRONTEND_URL } from '../../../urls/index';
import { useSendEmail } from '../../hooks/useSendEmail';

interface UseSendPasswordResetReturn {
  handlePasswordResetRequest: (email: string) => Promise<void>;
  error: string | undefined;
  isLoading: boolean;
}

const useSendPasswordReset = (): UseSendPasswordResetReturn => {
  const { sendEmail, isLoading } = useSendEmail();
  const [error, setError] = useState<string | undefined>(undefined);

  const handlePasswordResetRequest = async (email: string) => {
    setError(undefined);
    try {
      const body = {
        email,
        redirect_url: `${FRONTEND_URL}/reset-password`,
      };
      await sendEmail(PASSWORD_RESET_REQUEST_URL, body, '/checkemail');
    } catch (err) {
      setError('Failed to send password reset request');
    }
  };

  return {
    handlePasswordResetRequest, // emailを引数に取る
    error,
    isLoading,
  };
};

export default useSendPasswordReset;
