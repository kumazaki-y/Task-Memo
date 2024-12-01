import { type FC, useState } from 'react'; // useStateをインポート
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'; // 目のアイコンをインポート
import {
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement, // アイコンを表示するために使用
  IconButton, // 目のアイコンをボタンとして使う
  Link,
  FormErrorMessage,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import useLogin from '../../features/auth/hooks/useLogin'; // ログイン用フック
import {
  useValidation,
  type FormValues,
} from '../../features/hooks/useValidation'; // バリデーションフック
import { loginSchema } from '../../features/hooks/validationSchemas'; // バリデーションスキーマ
import Button from '../atoms/button';
import Card from '../templates/card';
import Layout from '../templates/layout';

const LoginForm: FC = () => {
  // useLoginフックを使用してログイン機能を取得
  const { handleLogin, error } = useLogin();

  // useValidationでバリデーションをセットアップ
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useValidation<FormValues>(loginSchema);

  // パスワード表示の切り替え用の状態を管理
  const [showPassword, setShowPassword] = useState(false);

  // パスワード表示の切り替えハンドラ
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // フォーム送信時のハンドラ（バリデーション済みのデータをhandleLoginに渡す）
  const onSubmit = async (data: { email: string; password: string }) => {
    await handleLogin(data); // バリデーション後のデータをhandleLoginに渡す
  };

  const inputBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Layout>
      <Card>
        <VStack
          spacing={6}
          as="form"
          onSubmit={handleSubmit(onSubmit)} // handleSubmitを使用してバリデーションと送信を行う
        >
          <Heading as="h1" size="2xl" textAlign="center">
            ログイン
          </Heading>

          {/* メールアドレス */}
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormLabel htmlFor="email">メールアドレス</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="メールアドレスを入力"
              bg={inputBg}
              autoComplete="email"
              {...register('email')} // react-hook-formのregisterでバリデーションを適用
            />
            <FormErrorMessage>{errors.email?.message ?? ''}</FormErrorMessage>
          </FormControl>

          {/* パスワード */}
          <FormControl isInvalid={Boolean(errors.password)}>
            <FormLabel htmlFor="password">パスワード</FormLabel>
            <InputGroup>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'} // showPassword状態で表示を切り替える
                placeholder="パスワードを入力"
                bg={inputBg}
                autoComplete="current-password"
                {...register('password')} // パスワードフィールドにもバリデーションを適用
              />
              <InputRightElement>
                <IconButton
                  aria-label={
                    showPassword ? 'パスワードを隠す' : 'パスワードを表示'
                  }
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} // 目のアイコンを切り替える
                  onClick={togglePasswordVisibility}
                  variant="ghost"
                  size="sm"
                  _focus={{ boxShadow: 'none' }} // ボタンのフォーカススタイルを無効化
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.password?.message ?? ''}
            </FormErrorMessage>
          </FormControl>

          {/* グローバルエラー表示 */}
          {error != null &&
            error !== '' && ( // errorがnull, undefined, または空文字列でない場合に表示
              <Text color="red.500" fontSize="sm" textAlign="center">
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
