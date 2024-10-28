import { type FC } from 'react';
import { Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import Card from '../templates/card';
import Layout from '../templates/layout';

const CheckResetEmail: FC = () => {
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Layout>
      <Card>
        <VStack spacing={4}>
          <Heading as="h1" size="xl" textAlign="center" color={textColor}>
            パスワード再設定メールを送信しました。
          </Heading>
          <Text fontSize="xl" textAlign="left" color={textColor}>
            メール内のリンクをクリックして、パスワードを再設定してください。
            メールが受信できない場合は迷惑メールフォルダをご確認ください。
            <br />
            <Text as="span" color="red.500">
              15分以内に再設定を行わない場合、メールのリンクは無効になります。
            </Text>
          </Text>
        </VStack>
      </Card>
    </Layout>
  );
};

export default CheckResetEmail;
