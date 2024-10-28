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
  VStack,
  FormErrorMessage,
  useColorModeValue,
} from '@chakra-ui/react';
import useResetPassword from '../../features/auth/hooks/useResetPassword'; // パスワードリセット用フック
import {
  useValidation,
  type FormValues,
} from '../../features/hooks/useValidation'; // バリデーションフック
import { resetPasswordSchema } from '../../features/hooks/validationSchemas'; // yupスキーマ
import Button from '../atoms/button';
import Card from '../templates/card';
import Layout from '../templates/layout';

const ResetPasswordForm: FC = () => {
  const { handleResetPassword, errorMessage } = useResetPassword();

  // パスワード表示切り替えのための状態管理
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useValidation<FormValues>(resetPasswordSchema);

  const onSubmit = async (data: {
    password: string;
    passwordConfirmation: string;
  }) => {
    await handleResetPassword(data.password, data.passwordConfirmation);
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
        <VStack spacing={6} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Heading as="h1" size="xl" textAlign="center">
            パスワードリセット
          </Heading>

          {/* 新しいパスワード */}
          <FormControl isInvalid={Boolean(errors.password)}>
            <FormLabel htmlFor="password">
              新しいパスワード（6文字以上）
            </FormLabel>
            <InputGroup>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'} // パスワード表示切り替え
                placeholder="新しいパスワードを入力"
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
            <FormErrorMessage>
              {errors.password?.message ?? ''}
            </FormErrorMessage>
          </FormControl>

          {/* パスワード確認 */}
          <FormControl isInvalid={Boolean(errors.passwordConfirmation)}>
            <FormLabel htmlFor="passwordConfirmation">パスワード確認</FormLabel>
            <InputGroup>
              <Input
                id="passwordConfirmation"
                type={showConfirmPassword ? 'text' : 'password'} // パスワード確認の表示切り替え
                placeholder="パスワードを再入力"
                bg={inputBg}
                autoComplete="new-password"
                {...register('passwordConfirmation')}
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
              <FormErrorMessage>
                {errors.passwordConfirmation?.message ?? ''}
              </FormErrorMessage>
            </FormErrorMessage>
          </FormControl>

          {errorMessage != null && errorMessage !== '' && (
            <Text color="red.500" fontSize="sm">
              {errorMessage}
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
