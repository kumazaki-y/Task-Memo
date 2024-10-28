import { type FC } from 'react';
import {
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Card from '../templates/card';
import Layout from '../templates/layout';

const CheckEmail: FC = () => {
  const textColor = useColorModeValue('gray.800', 'white');
  const navigate = useNavigate();

  const handleResendRedirect = () => {
    navigate('/resendemail');
  };

  return (
    <Layout>
      <Card>
        <VStack spacing={4}>
          <Heading as="h1" size="xl" textAlign="center" color={textColor}>
            認証用メールを送信しました。
          </Heading>
          <Text fontSize="xl" textAlign="left" color={textColor}>
            メール内のリンクをクリックして、登録を完了してください。
            メールが受信できない場合は迷惑メールフォルダをご確認ください。
            <br />
            <Text as="span" color="red.500">
              15分以内に手続きを行わなかった場合、メールのリンクは無効になります。
            </Text>
          </Text>
          <Button onClick={handleResendRedirect} colorScheme="purple">
            確認メールを再送信
          </Button>
        </VStack>
      </Card>
    </Layout>
  );
};

export default CheckEmail;
