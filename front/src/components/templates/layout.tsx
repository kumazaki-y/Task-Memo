import { type FC, type ReactNode } from 'react';
import { Box, Container, useColorModeValue } from '@chakra-ui/react';

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
      minHeight="100vh"
      width="100%"
      bgGradient={bgGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxWidth="800px" centerContent>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
