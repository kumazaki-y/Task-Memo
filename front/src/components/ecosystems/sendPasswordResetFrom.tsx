import { type FC, useState } from 'react';
import {
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import useSendPasswordReset from '../../features/auth/hooks/useSendPasswordReset';
import Button from '../atoms/button';
import Card from '../templates/card';
import Layout from '../templates/layout';

const SendPasswordResetForm: FC = () => {
  const {
    handlePasswordResetRequest,
    error: apiError,
    isLoading,
  } = useSendPasswordReset();

  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const inputBg = useColorModeValue('gray.100', 'gray.700');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (email.trim() === '') {
      setFormError('メールアドレスを入力してください');

      return;
    }

    setFormError(undefined);
    await handlePasswordResetRequest(email);
  };

  return (
    <Layout>
      <Card>
        <VStack
          spacing={6}
          as="form"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit(e);
          }}
        >
          <Heading as="h1" size="xl" textAlign="center">
            パスワードリセット
          </Heading>

          {/* メールアドレス入力フィールド */}
          <FormControl isInvalid={Boolean(formError ?? apiError)}>
            <FormLabel htmlFor="email">メールアドレス</FormLabel>
            <Input
              id="email"
              type="email"
              value={email ?? ''}
              onChange={(e) => {
                setEmail(e.target.value ?? '');
              }}
              placeholder="メールアドレスを入力"
              bg={inputBg}
            />
          </FormControl>

          {/* エラーメッセージ表示 */}
          {Boolean(formError ?? apiError) && (
            <Text color="red.500" fontSize="sm">
              {formError ?? apiError}
            </Text>
          )}

          {/* 送信ボタン */}
          <Button
            label="送信"
            type="submit"
            colorScheme="purple"
            size="md"
            isLoading={isLoading}
          />

          {/* ログインページへのリンク */}
          <Text fontSize="sm">
            <Link as={RouterLink} to="/login" color="purple.500">
              ログインページに戻る
            </Link>
          </Text>
        </VStack>
      </Card>
    </Layout>
  );
};

export default SendPasswordResetForm;
