import { type FC } from 'react';
import {
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import useSendPasswordReset from '../../features/auth/hooks/useSendPasswordReset'; // パスワードリセットフック
import {
  useValidation,
  type FormValues,
} from '../../features/hooks/useValidation'; // バリデーションフック
import { sendResetPasswordSchema } from '../../features/hooks/validationSchemas'; // yupスキーマ
import Button from '../atoms/button';
import Card from '../templates/card';
import Layout from '../templates/layout';

const SendPasswordResetForm: FC = () => {
  const {
    handlePasswordResetRequest,
    error: apiError,
    isLoading,
  } = useSendPasswordReset();

  // バリデーションのセットアップ
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useValidation<FormValues>(sendResetPasswordSchema);

  // フォーム送信時のハンドラ
  const onSubmit = async (data: { email: string }) => {
    await handlePasswordResetRequest(data.email); // バリデーション済みデータを渡す
  };

  const inputBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Layout>
      <Card>
        <VStack
          spacing={6}
          as="form"
          onSubmit={handleSubmit(onSubmit)} // handleSubmitを使用してバリデーションと送信
        >
          <Heading as="h1" size="xl" textAlign="center">
            パスワードリセット
          </Heading>

          {/* メールアドレス入力フィールド */}
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormLabel htmlFor="email">メールアドレス</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="メールアドレスを入力"
              bg={inputBg}
              {...register('email')} // バリデーションを適用
            />
            <FormErrorMessage>{errors.email?.message ?? ''}</FormErrorMessage>
          </FormControl>

          {/* エラーメッセージ表示（サーバー側エラー） */}
          {apiError != null && apiError !== '' && (
            <Text color="red.500" fontSize="sm">
              {apiError}
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
