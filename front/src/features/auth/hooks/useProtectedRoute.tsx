import { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../../App';

interface ProtectedRouteProps {
  children: ReactNode;
}

const useProtectedRoute = ({
  children,
}: ProtectedRouteProps): ReactNode | null => {
  const { loading, isSignedIn } = useContext(AuthContext);

  if (!loading) {
    if (isSignedIn) {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  } else {
    return null; // ローディング中は何も表示しない
  }
};

export default useProtectedRoute;
