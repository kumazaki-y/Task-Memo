import { type FC } from 'react';
import './App.css';
import { createContext } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { useAuth } from '../src/features/auth/hooks/useAuth';
import AppRoutes from '../src/routes/index';

interface User {
  id: number;
  email: string;
}

export const AuthContext = createContext<{
  loading: boolean;
  isSignedIn: boolean;
  currentUser: User | null;
}>({
  loading: true,
  isSignedIn: false,
  currentUser: null,
});

const App: FC = () => {
  const { loading, isSignedIn, currentUser } = useAuth();

  return (
    <>
      <ChakraProvider>
        <AuthContext.Provider value={{ loading, isSignedIn, currentUser }}>
          <AppRoutes />
        </AuthContext.Provider>
      </ChakraProvider>
    </>
  );
};

export default App;
