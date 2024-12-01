import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PASSWORD_RESET_REQUEST_URL } from 'urls';

// Cookie操作用ヘルパー関数
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; secure`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

  if (match?.[2] != null) {
    const decodedValue = decodeURIComponent(match[2]);

    return decodedValue !== '' ? decodedValue : null;
  }

  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/`;
};

// 認証情報をCookieから取得してヘッダーに追加する関数
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'access-token': getCookie('access-token') ?? '',
    client: getCookie('client') ?? '',
    uid: getCookie('uid') ?? '',
  };
};

const useResetPassword = (): {
  password: string;
  setPassword: (password: string) => void;
  passwordConfirmation: string;
  setPasswordConfirmation: (passwordConfirmation: string) => void;
  errorMessage: string | undefined;
  handleResetPassword: (
    password: string,
    passwordConfirmation: string,
  ) => Promise<void>;
} => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const navigate = useNavigate();

  useEffect(() => {
    // URLパラメータから認証情報を取得し、Cookieに保存
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
      setCookie('access-token', accessToken, 7);
      setCookie('client', client, 7);
      setCookie('uid', uid, 7);
      setCookie('reset_password_token', resetPasswordToken, 7);
    }
  }, [searchParams]);

  // パスワードリセット処理
  const handleResetPassword = async (
    password: string,
    passwordConfirmation: string,
  ) => {
    setErrorMessage(undefined);

    try {
      const resetPasswordToken = getCookie('reset_password_token') ?? '';
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
        credentials: 'include',
      });

      if (response.ok) {
        // Cookieをクリアし、リセット完了画面に遷移
        deleteCookie('reset_password_token');
        deleteCookie('access-token');
        deleteCookie('client');
        deleteCookie('uid');
        navigate('/reset-password-complete');
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
