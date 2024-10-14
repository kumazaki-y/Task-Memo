import { type FC, useState } from 'react';
import {
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Link,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import useRegister from '../../features/auth/hooks/useRegister';
import Button from '../atoms/button';
import Card from '../templates/card';
import Layout from '../templates/layout';

const RegisterForm: FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    handleRegister,
  } = useRegister();
  const [formError, setFormError] = useState<string | undefined>(undefined); // フォームエラーメッセージ
  const inputBg = useColorModeValue('gray.100', 'gray.700');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // カスタムバリデーション
    if (password.length < 6) {
      setFormError('パスワードは6文字以上で入力してください');

      return;
    }

    if (password !== confirmPassword) {
      setFormError('パスワードが一致しません');

      return;
    }

    // エラーがない場合は次の処理へ
    setFormError(undefined);
    await handleRegister(e);
  };

  return (
    <Layout>
      <Card>
        <VStack
          spacing={6}
          as="form"
          onSubmit={handleSubmit} // handleSubmit関数を使用
        >
          <Heading as="h1" size="2xl" textAlign="center">
            新規登録
          </Heading>

          {/* メールアドレス */}
          <FormControl isInvalid={Boolean(error)}>
            <FormLabel htmlFor="email">メールアドレス</FormLabel>
            <Input
              id="email"
              type="email"
              value={email ?? ''}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="メールアドレスを入力"
              bg={inputBg}
              autoComplete="username"
            />
          </FormControl>

          {/* パスワード */}
          <FormControl isInvalid={Boolean(formError)}>
            <FormLabel htmlFor="password">パスワード（6文字以上）</FormLabel>
            <Input
              id="password"
              type="password"
              value={password ?? ''}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="6文字以上のパスワードを入力"
              bg={inputBg}
              autoComplete="new-password"
            />
          </FormControl>

          {/* パスワード（確認） */}
          <FormControl isInvalid={Boolean(formError)}>
            <FormLabel htmlFor="confirmPassword">パスワード（確認）</FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword ?? ''}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              placeholder="もう一度パスワードを入力"
              bg={inputBg}
              autoComplete="new-password"
            />
          </FormControl>

          {(formError !== undefined &&
            formError !== null &&
            formError !== '') ||
          (error !== undefined && error !== null && error !== '') ? (
            <Text color="red.500" fontSize="sm">
              {formError ?? error}
            </Text>
          ) : null}

          <Button label="登録" type="submit" colorScheme="pink" size="md" />
          <Text fontSize="sm">
            <Link as={RouterLink} to="/login" color="purple.500">
              既にアカウントをお持ちの方はこちら
            </Link>
          </Text>
        </VStack>
      </Card>
    </Layout>
  );
};

export default RegisterForm;
