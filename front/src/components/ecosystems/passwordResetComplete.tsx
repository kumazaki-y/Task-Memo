import { type FC } from 'react';
import { Heading, Text, useColorModeValue, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '../templates/card';
import Layout from '../templates/layout';

const PasswordResetComplete: FC = () => {
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Layout>
      <Card>
        <Heading as="h1" size="xl" textAlign="center" color={textColor}>
          パスワードリセットが完了しました
        </Heading>
        <Text fontSize="md" textAlign="center" color={textColor} mb={4}>
          新しいパスワードでログインしてください。
        </Text>
        <Link
          as={RouterLink}
          to="/login"
          color="purple.500"
          fontSize="md"
          textAlign="center"
        >
          ログイン画面へ
        </Link>
      </Card>
    </Layout>
  );
};

export default PasswordResetComplete;
