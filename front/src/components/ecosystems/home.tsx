import { type FC } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import useGuestLogin from '../../features/auth/hooks/useGuestLogin';
import { DEFAULT_API_BASE_URL } from '../../urls/index';
import Button from '../atoms/button';
import Layout from '../templates/layout';

interface MessageResponse {
  message: string;
}

const fetcher = async (url: string): Promise<MessageResponse> => {
  const res = await fetch(url);

  return res.json() as unknown as MessageResponse;
};

const Home: FC = () => {
  const { data, error } = useSWR<MessageResponse, Error>(
    DEFAULT_API_BASE_URL,
    fetcher,
  );

  const navigate = useNavigate();
  const { handleGuestLogin } = useGuestLogin();
  const cardBg = useColorModeValue('white', 'gray.800');

  // エラーメッセージを表示
  if (error != null) {
    return (
      <Layout>
        <Text fontSize="xl" mt="20" color="red.500">
          エラーが発生しました。再度お試しください。
        </Text>
      </Layout>
    );
  }

  // データがまだロードされていない場合のローディング表示
  if (data == null) {
    return (
      <Layout>
        <Text fontSize="xl" mt="20">
          読み込み中...
        </Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        bg={cardBg}
        borderRadius="lg"
        p={8}
        boxShadow="2xl"
        maxWidth="400px"
        width="100%"
      >
        <VStack spacing={6}>
          <Heading as="h1" size="2xl" textAlign="center">
            Task-Memo
          </Heading>
          <Text fontSize="lg" textAlign="center">
            {data.message}
          </Text>
          <Button
            label="ログイン"
            onClick={() => {
              navigate('/login');
            }}
          />
          <Button
            label="新規登録"
            onClick={() => {
              navigate('/register');
            }}
            colorScheme="pink"
          />
          <Button
            label="ゲストログイン"
            onClick={handleGuestLogin}
            colorScheme="teal"
          />
        </VStack>
      </Box>
    </Layout>
  );
};

export default Home;
