import { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Text,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import useResendConfirmation from '../../features/auth/hooks/useResendConfirmation';
import Button from '../atoms/button'; // 汎用ボタンをインポート
import Card from '../templates/card';
import Layout from '../templates/layout';

const ResendConfirmationForm = (): JSX.Element => {
  const { email, setEmail, handleResend, resendMessage, isLoading } =
    useResendConfirmation();
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const textColor = useColorModeValue('gray.800', 'white');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === '') {
      setFormError('メールアドレスを入力してください');

      return;
    }

    setFormError(undefined);
    await handleResend();
  };

  return (
    <Layout>
      <Card>
        <VStack as="form" spacing={6} onSubmit={handleSubmit}>
          <Heading as="h1" size="2xl" textAlign="center" color={textColor}>
            確認メールの再送信
          </Heading>

          <FormControl isInvalid={Boolean(formError)}>
            <FormLabel color={textColor}>メールアドレス</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="メールアドレスを入力"
            />
          </FormControl>

          {formError != null && formError !== '' && (
            <Text color="red.500" fontSize="sm">
              {formError}
            </Text>
          )}

          {resendMessage != null && resendMessage !== '' && (
            <Text color="green.500" fontSize="sm">
              {resendMessage}
            </Text>
          )}

          {/* 汎用ボタンを使用 */}
          <Button
            label="確認メールを再送信"
            type="submit"
            colorScheme="purple"
            isLoading={isLoading}
          />
        </VStack>
      </Card>
    </Layout>
  );
};

export default ResendConfirmationForm;
