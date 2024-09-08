import { type FC } from 'react';
import { Link } from 'react-router-dom';

const PasswordResetComplete: FC = () => {
  return (
    <div>
      <h1>パスワードリセットが完了しました</h1>
      <p>新しいパスワードでログインしてください。</p>
      <Link to="/login">ログイン画面へ</Link>
    </div>
  );
};

export default PasswordResetComplete;
