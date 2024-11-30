// ログイン状態を確認するフック
import { useEffect, useState } from 'react';
import { USER_SESSIONS } from 'urls';

interface User {
  id: number;
  email: string;
}

interface Authstate {
  loading: boolean;
  isSignedIn: boolean;
  currentUser: User | null;
}

// Cookieの操作用ヘルパー関数
const getCookie = (name: string): string | null => {
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

  if (match?.[2] != null) {
    const decodedValue = decodeURIComponent(match[2]);

    return decodedValue !== '' ? decodedValue : null;
  }

  return null;
};

export const useAuth = (): Authstate => {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const getCurrentUser = async () => {
    const accessToken = getCookie('access-token');
    const client = getCookie('client');
    const uid = getCookie('uid');

    // Cookieにトークンがなければ認証されていないと判断
    if (
      accessToken === null ||
      accessToken.trim() === '' ||
      client === null ||
      client.trim() === '' ||
      uid === null ||
      uid.trim() === ''
    ) {
      setLoading(false);

      return;
    }

    try {
      const response = await fetch(USER_SESSIONS, {
        method: 'GET',
        headers: {
          'access-token': accessToken,
          client,
          uid,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = (await response.json()) as { user: User };
        setIsSignedIn(true);
        setCurrentUser(data.user);
      } else {
        setIsSignedIn(false);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCurrentUser();
    };

    void fetchData(); // Promise を無視することを明示するために void を使用
  }, []);

  return { loading, isSignedIn, currentUser };
};
