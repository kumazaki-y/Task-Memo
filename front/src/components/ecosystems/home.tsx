import { type FC, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import useGuestLogin from '../../features/auth/hooks/useGuestLogin';
import Button from '../atoms/button';

// APIから返ってくるJSONデータの型を定義
interface MessageResponse {
  message: string;
}

// fetcher関数を定義し、戻り値の型をMessageResponseに指定
const fetcher = async (url: string): Promise<MessageResponse> => {
  const res = await fetch(url);

  return res.json() as unknown as MessageResponse;
};
const Home: FC = () => {
  // useSWRの戻り値に型を指定
  const { data } = useSWR<MessageResponse>('http://localhost:3000', fetcher, {
    suspense: true,
  });

  const navigate = useNavigate();
  const { handleGuestLogin } = useGuestLogin();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <h1>Reclaim Time</h1>
        <p>{data?.message}</p>
        <div className="button-group">
          <Button label="Login" onClick={handleLogin} />
          <Button label="Register" onClick={handleRegister} />
          <Button label="Guest Login" onClick={handleGuestLogin} />
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
