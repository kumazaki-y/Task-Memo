import { type FC, useState } from 'react';
import useSendPasswordReset from '../../features/auth/hooks/useSendPasswordReset';
import Button from '../atoms/button';
import InputField from '../atoms/inputField';
import FormContainer from '../molecules/formContainer';

const SendPasswordResetForm: FC = () => {
  const { handlePasswordResetRequest, error, isLoading } =
    useSendPasswordReset();

  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (email.trim() === '') {
      setFormError('メールアドレスを入力してください');

      return;
    }

    setFormError(null);
    await handlePasswordResetRequest(email);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputField
        type="email"
        placeholder="メールアドレス"
        error={formError}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }} // フォーム入力の変更をハンドリング
      />
      <Button type="submit" label={isLoading ? '送信中...' : '送信'} />
      {formError !== null && <p className="error-message">{formError}</p>}
      {error !== null && <p className="error-message">{error}</p>}
    </FormContainer>
  );
};

export default SendPasswordResetForm;
