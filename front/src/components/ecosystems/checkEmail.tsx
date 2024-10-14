import { type FC } from 'react';
import { Heading, Text, useColorModeValue } from '@chakra-ui/react';
import Card from '../templates/card';
import Layout from '../templates/layout';

const EmailSent: FC = () => {
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Layout>
      <Card>
        <Heading as="h1" size="xl" textAlign="center" color={textColor}>
          メールを送信しました
        </Heading>
        <Text fontSize="md" textAlign="center" color={textColor}>
          ご登録いただいたメールアドレスに確認メールを送信しました。メールをご確認ください。
        </Text>
      </Card>
    </Layout>
  );
};

export default EmailSent;
