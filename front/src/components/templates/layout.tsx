import { type FC, type ReactNode } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const bgGradient = useColorModeValue(
    'linear(to-r, purple.400, pink.500)',
    'linear(to-r, purple.900, pink.800)',
  );

  return (
    <Box
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
        bgGradient="linear(to-r, purple.600, pink.700)"
        alignItems="center"
        zIndex="1"
      >
        <Link as={RouterLink} to="/" style={{ textDecoration: 'none' }}>
          <Heading size="lg" color="white">
            Task-Memo
          </Heading>
        </Link>
      </Flex>

      {/* Main Content */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        pt="80px" // Headerの高さ分の余白
      >
        <Container maxWidth="1600px" centerContent>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
