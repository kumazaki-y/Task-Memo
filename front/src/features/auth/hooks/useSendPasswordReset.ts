import { PASSWORD_RESET_REQUEST_URL } from 'urls';
import { useSendEmail } from './useSendEmail';

interface UseSendPasswordResetReturn {
  handlePasswordResetRequest: (email: string) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

const useSendPasswordReset = (): UseSendPasswordResetReturn => {
  const { sendEmail, error, isLoading } = useSendEmail();

  const handlePasswordResetRequest = async (email: string) => {
    const body = {
      email,
      redirect_url: 'http://localhost:5173/reset-password',
    };

    await sendEmail(PASSWORD_RESET_REQUEST_URL, body, '/checkemail');
  };

  return {
    handlePasswordResetRequest, // emailを引数に取る
    error,
    isLoading,
  };
};

export default useSendPasswordReset;
