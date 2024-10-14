import { type FC } from 'react';
import {
  Heading,
  Text,
  FormControl,
  FormLabel,
  Link,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import useLogin from '../../features/auth/hooks/useLogin';
import Button from '../atoms/button';
import InputField from '../atoms/inputField';
import Card from '../templates/card';
import Layout from '../templates/layout';

const LoginForm: FC = () => {
  const { email, setEmail, password, setPassword, error, handleLogin } =
    useLogin();
  const inputBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Layout>
      <Card>
        <VStack
          spacing={6}
          as="form"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleLogin(e);
          }}
        >
          <Heading as="h1" size="2xl" textAlign="center">
            ログイン
          </Heading>
          <FormControl isInvalid={Boolean(error)}>
            <FormLabel htmlFor="email">メールアドレス</FormLabel>
            <InputField
              type="email"
              value={email ?? ''}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="メールアドレスを入力"
              autocomplete="email"
              bg={inputBg}
            />
          </FormControl>
          <FormControl isInvalid={Boolean(error)}>
            <FormLabel htmlFor="password">パスワード</FormLabel>
            <InputField
              type="password"
              value={password ?? ''}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="パスワードを入力"
              autocomplete="current-password"
              bg={inputBg}
            />
          </FormControl>
          {Boolean(error) && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <Button
            label="ログイン"
            type="submit"
            colorScheme="purple"
            size="md"
          />
          <Text fontSize="sm">
            <Link as={RouterLink} to="/register" color="purple.500" mr={2}>
              新規登録
            </Link>
            |
            <Link as={RouterLink} to="/password" color="purple.500" ml={2}>
              パスワードをお忘れの方
            </Link>
          </Text>
        </VStack>
      </Card>
    </Layout>
  );
};

export default LoginForm;
