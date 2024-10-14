import { type FC, useState } from 'react';
import {
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import useResetPassword from '../../features/auth/hooks/useResetPassword';
import Button from '../atoms/button';
import Card from '../templates/card';
import Layout from '../templates/layout';

const ResetPasswordForm: FC = () => {
  const {
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    errorMessage,
    handleResetPassword,
  } = useResetPassword();
  const [formError, setFormError] = useState<string | undefined>(undefined); // フォームエラーメッセージ
  const inputBg = useColorModeValue('gray.100', 'gray.700');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // バリデーション: パスワードの長さ
    if (password.length < 6) {
      setFormError('パスワードは6文字以上で入力してください');

      return;
    }

    // バリデーション: パスワードの一致確認
    if (password !== passwordConfirmation) {
      setFormError('パスワードが一致しません');

      return;
    }

    // エラーメッセージをクリアしてパスワードリセット処理を実行
    setFormError(undefined);
    await handleResetPassword();
  };

  return (
    <Layout>
      <Card>
        <VStack spacing={6} as="form" onSubmit={onSubmit}>
          <Heading as="h1" size="xl" textAlign="center">
            パスワードリセット
          </Heading>

          {/* 新しいパスワード */}
          <FormControl isInvalid={Boolean(formError ?? errorMessage)}>
            <FormLabel htmlFor="password">
              新しいパスワード（6文字以上）
            </FormLabel>
            <Input
              id="password"
              type="password"
              value={password ?? ''}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="新しいパスワードを入力"
              bg={inputBg}
              autoComplete="new-password"
            />
          </FormControl>

          {/* パスワード確認 */}
          <FormControl isInvalid={Boolean(formError ?? errorMessage)}>
            <FormLabel htmlFor="passwordConfirmation">パスワード確認</FormLabel>
            <Input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation ?? ''}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
              }}
              placeholder="パスワードを再入力"
              bg={inputBg}
              autoComplete="new-password"
            />
          </FormControl>

          {((formError !== undefined && formError !== '') ||
            (errorMessage !== undefined && errorMessage !== '')) && (
            <Text color="red.500" fontSize="sm">
              {formError ?? errorMessage}
            </Text>
          )}

          <Button
            label="パスワードをリセット"
            type="submit"
            colorScheme="purple"
            size="md"
          />
        </VStack>
      </Card>
    </Layout>
  );
};

export default ResetPasswordForm;
