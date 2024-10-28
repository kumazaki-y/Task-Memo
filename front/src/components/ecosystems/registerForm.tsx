import { type FC, useState } from 'react'; // useStateをインポート
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'; // 目のアイコンをインポート
import {
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement, // アイコン表示用
  IconButton, // アイコンボタン用
  Link,
  FormErrorMessage, // フォームエラーメッセージ
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import useRegister from '../../features/auth/hooks/useRegister'; // 登録用フック
import {
  useValidation,
  type FormValues,
} from '../../features/hooks/useValidation'; // バリデーションフック
import { registerSchema } from '../../features/hooks/validationSchemas'; // yupスキーマ
import Button from '../atoms/button';
import Card from '../templates/card';
import Layout from '../templates/layout';

const RegisterForm: FC = () => {
  const { handleRegister, isLoading, error } = useRegister();

  // パスワード表示切り替えのための状態管理
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // バリデーションのセットアップ
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useValidation<FormValues>(registerSchema);

  // フォーム送信時のハンドラ
  const onSubmit = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    await handleRegister(data); // バリデーション済みデータを渡す
  };

  // パスワード表示切り替えハンドラ
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const inputBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Layout>
      <Card>
        <VStack
          spacing={6}
          as="form"
          onSubmit={handleSubmit(onSubmit)} // handleSubmitでバリデーションと送信
        >
          <Heading as="h1" size="2xl" textAlign="center">
            新規登録
          </Heading>

          {/* メールアドレス */}
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormLabel htmlFor="email">メールアドレス</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="メールアドレスを入力"
              bg={inputBg}
              autoComplete="username"
              {...register('email')}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          {/* パスワード */}
          <FormControl isInvalid={Boolean(errors.password)}>
            <FormLabel htmlFor="password">パスワード（6文字以上）</FormLabel>
            <InputGroup>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'} // パスワード表示切り替え
                placeholder="6文字以上のパスワードを入力"
                bg={inputBg}
                autoComplete="new-password"
                {...register('password')}
              />
              <InputRightElement>
                <IconButton
                  aria-label={
                    showPassword ? 'パスワードを隠す' : 'パスワードを表示'
                  }
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={togglePasswordVisibility}
                  variant="ghost"
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          {/* パスワード確認 */}
          <FormControl isInvalid={Boolean(errors.confirmPassword)}>
            <FormLabel htmlFor="confirmPassword">パスワード確認</FormLabel>
            <InputGroup>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'} // パスワード確認の表示切り替え
                placeholder="もう一度パスワードを入力"
                bg={inputBg}
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              <InputRightElement>
                <IconButton
                  aria-label={
                    showConfirmPassword
                      ? 'パスワード確認を隠す'
                      : 'パスワード確認を表示'
                  }
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={toggleConfirmPasswordVisibility}
                  variant="ghost"
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.confirmPassword?.message}
            </FormErrorMessage>
          </FormControl>

          {/* エラーメッセージ（サーバー側エラー） */}
          {error != null && error !== '' && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}

          <Button
            label="登録"
            type="submit"
            colorScheme="pink"
            size="md"
            isLoading={isLoading}
          />
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
