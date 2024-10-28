import { type FC, type ReactNode, useRef } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import useLogout from '../../features/auth/hooks/useLogout';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const bgGradient = useColorModeValue(
    'linear(to-r, green.400, teal.500)',
    'linear(to-r, green.900, teal.800)',
  );
  const logout = useLogout();

  // Boxのrefを作成
  const boxRef = useRef<HTMLDivElement>(null);

  // ロゴをクリックしてページのトップに戻す
  const handleLogoClick = () => {
    if (boxRef.current != null) {
      boxRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box
      ref={boxRef} // refをBoxに設定
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bgGradient={bgGradient}
      overflow="auto"
    >
      {/* Header */}
      <Flex
        as="header"
        position="fixed"
        top={0}
        width="100%"
        p={4}
        bgGradient="linear(to-r, green.600, teal.700)"
        alignItems="center"
        justifyContent="space-between"
        zIndex="1"
      >
        {/* ロゴ */}
        <Heading
          size="lg"
          color="white"
          onClick={handleLogoClick}
          cursor="pointer"
        >
          Task-Memo
        </Heading>

        {/* ログアウトボタン */}
        <Button
          onClick={logout}
          bg="transparent"
          color="white"
          borderColor="white"
          borderWidth={1}
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          ログアウト
        </Button>
      </Flex>

      {/* Main Content */}
      <Box
        pt="80px" // ヘッダー分の余白
        pb="20px"
      >
        <Container maxWidth="1600px">{children}</Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
