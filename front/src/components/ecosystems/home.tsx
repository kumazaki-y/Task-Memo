import { type FC } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Image,
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
        <Box
          p="0" // 内側の余白をゼロに
          m="0" // 外側の余白をゼロに
          bg="white"
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          boxShadow="md"
          display="flex" // フレックスボックスで中央揃え
          justifyContent="center" // 横方向で中央揃え
          alignItems="center" // 縦方向で中央揃え
          minHeight="200px" // ボックス全体の高さを確保
        >
          <Text fontSize="xl" mt="20" color="red.500">
            アプリの稼働時間外です。
            <br />
            平日9:00〜18:00の時間帯に再度お試しください。
          </Text>
        </Box>
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
        maxWidth="1200px"
        width="100%"
        minHeight="700px"
        mx="auto"
        mt={{ base: 4, md: 10 }} // モバイルでは小さな上マージン
        mb={{ base: 4, md: 10 }} // モバイルでは小さな下マージン
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justifyContent="space-around"
          width="100%"
          gap={{ base: 4, md: 0 }}
        >
          {/* 左側の画像（比率を指定） */}
          <Box flex="1" maxWidth="600px" width="100%">
            <Image
              src="/images/home.webp"
              alt="Task management app illustration"
              maxWidth="100%" // Box内で幅いっぱいに表示
              height="auto"
              borderRadius="lg"
              objectFit="contain"
            />
          </Box>

          {/* 右側の説明文とボタン（比率を指定） */}
          <VStack flex="1.5" align="center" maxWidth="400px" width="100%">
            <Heading
              as="h1"
              size="3xl"
              textAlign="center"
              mb={{ base: 8, md: 20 }}
            >
              Task-Memo
            </Heading>

            <Text
              fontSize="lg"
              textAlign="center"
              fontWeight="bold"
              mb={{ base: 8, md: 20 }}
            >
              {data.message}
            </Text>

            <VStack spacing={{ base: 8, md: 10 }} width="100%">
              <Button
                label="ログイン"
                size="lg"
                onClick={() => {
                  navigate('/login');
                }}
                width="300px"
              />
              <Button
                label="新規登録"
                size="lg"
                colorScheme="pink"
                onClick={() => {
                  navigate('/register');
                }}
                width="300px"
              />
              <Button
                label="ゲストログイン"
                size="lg"
                colorScheme="teal"
                onClick={handleGuestLogin}
                width="300px"
              />
            </VStack>
          </VStack>
        </Flex>
      </Box>
    </Layout>
  );
};

export default Home;
