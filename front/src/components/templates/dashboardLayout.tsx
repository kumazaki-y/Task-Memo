import { type FC, type ReactNode } from 'react';
import { Box, Container, VStack, useColorModeValue } from '@chakra-ui/react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
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
      alignItems="flex-start" // 上部に配置
      justifyContent="center"
      pt={8} // 上部に余白を確保
    >
      <Container maxWidth="800px" p={0}>
        <VStack spacing={6} align="stretch" width="100%">
          {children}
        </VStack>
      </Container>
    </Box>
  );
};

export default DashboardLayout;
