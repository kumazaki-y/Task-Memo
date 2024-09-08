import { type FC } from 'react';
import useResetPassword from '../../features/auth/hooks/useResetPassword';
import Button from '../atoms/button';
import InputField from '../atoms/inputfield';

const ResetPasswordForm: FC = () => {
  const {
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    errorMessage,
    handleResetPassword,
  } = useResetPassword();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleResetPassword();
  };

  return (
    <form onSubmit={onSubmit}>
      <InputField
        type="password"
        placeholder="新しいパスワード"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <InputField
        type="password"
        placeholder="パスワード確認"
        value={passwordConfirmation}
        onChange={(e) => {
          setPasswordConfirmation(e.target.value);
        }}
      />
      <Button type="submit" label="パスワードをリセット" />
      {errorMessage !== null && errorMessage !== '' && (
        <p className="error-message">{errorMessage}</p>
      )}
    </form>
  );
};

export default ResetPasswordForm;
