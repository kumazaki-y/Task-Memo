import { type FC } from 'react';
import './App.css';
import { createContext } from 'react';
import { useAuth } from '../src/features/auth/hooks/useAuth';
import AppRoutes from '../src/routes/index';

export const AuthContext = createContext({
  loading: true,
  isSignedIn: false,
  currentUser: null,
});

const App: FC = () => {
  const { loading, isSignedIn, currentUser } = useAuth();

  return (
    <>
      <AuthContext.Provider value={{ loading, isSignedIn, currentUser }}>
        <AppRoutes />
      </AuthContext.Provider>
    </>
  );
};

export default App;
