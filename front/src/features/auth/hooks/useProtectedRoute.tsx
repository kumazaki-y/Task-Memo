import { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../../App';

// Cookieから特定の値を取得するためのヘルパー関数
const getCookie = (name: string): string | null => {
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

  if (match?.[2] != null) {
    const decodedValue = decodeURIComponent(match[2]);

    return decodedValue !== '' ? decodedValue : null;
  }

  return null;
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const useProtectedRoute = ({
  children,
}: ProtectedRouteProps): ReactNode | null => {
  const { loading, isSignedIn } = useContext(AuthContext);

  // Cookieから reset_password_token を取得
  const resetPasswordToken = getCookie('reset_password_token');

  if (resetPasswordToken !== null) {
    // reset_password_token がある場合、パスワードリセットページへリダイレクト
    return <Navigate to="/reset-password" replace />;
  }

  if (!loading) {
    if (isSignedIn) {
      // ユーザーがサインインしている場合、子コンポーネントを表示
      return children;
    } else {
      // サインインしていない場合、ログインページへリダイレクト
      return <Navigate to="/" replace />;
    }
  } else {
    // ローディング中は何も表示しない
    return null;
  }
};

export default useProtectedRoute;
