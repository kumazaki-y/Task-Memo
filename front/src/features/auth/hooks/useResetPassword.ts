import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PASSWORD_RESET_REQUEST_URL } from 'urls';

// ローカルストレージからトークンを取得し、ヘッダーに追加する関数
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'access-token': localStorage.getItem('access-token') ?? '',
    client: localStorage.getItem('client') ?? '',
    uid: localStorage.getItem('uid') ?? '',
  };
};

const useResetPassword = (): {
  password: string;
  setPassword: (password: string) => void;
  passwordConfirmation: string;
  setPasswordConfirmation: (passwordConfirmation: string) => void;
  errorMessage: string | undefined;
  handleResetPassword: () => Promise<void>;
} => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const navigate = useNavigate();

  useEffect(() => {
    // 認証メールからリダイレクトした際にURLからトークンなどの情報を取得し、ローカルストレージに保存
    const accessToken = searchParams.get('access-token');
    const client = searchParams.get('client');
    const uid = searchParams.get('uid');
    const resetPasswordToken = searchParams.get('token');

    if (
      accessToken !== null &&
      client !== null &&
      uid !== null &&
      resetPasswordToken !== null
    ) {
      localStorage.setItem('access-token', accessToken);
      localStorage.setItem('client', client);
      localStorage.setItem('uid', uid);
      localStorage.setItem('reset_password_token', resetPasswordToken);
    }
  }, [searchParams]);

  // パスワードリセット処理
  const handleResetPassword = async () => {
    setErrorMessage(null);

    try {
      const resetPasswordToken =
        localStorage.getItem('reset_password_token') ?? '';
      const response = await fetch(PASSWORD_RESET_REQUEST_URL, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          password,
          password_confirmation: passwordConfirmation,
          reset_password_token: resetPasswordToken,
        }),
      });

      if (response.ok) {
        localStorage.removeItem('reset_password_token');
        localStorage.removeItem('access-token');
        localStorage.removeItem('client');
        localStorage.removeItem('uid');
        navigate('/reset-password-complete'); // リセット成功時の処理
      } else {
        setErrorMessage(
          'パスワードリセットに失敗しました。もう一度お試しください。',
        );
      }
    } catch (error) {
      setErrorMessage('エラーが発生しました。もう一度お試しください。');
    }
  };

  return {
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    errorMessage,
    handleResetPassword,
  };
};

export default useResetPassword;
