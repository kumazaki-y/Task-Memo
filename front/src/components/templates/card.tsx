import { type FC, type ReactNode } from 'react';
import { Box, VStack, useColorModeValue } from '@chakra-ui/react';

interface CardProps {
  children: ReactNode;
}

const Card: FC<CardProps> = ({ children }) => {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      p={8}
      boxShadow="xl"
      maxWidth="800px"
      width="100%"
    >
      <VStack spacing={6} align="stretch">
        {children}
      </VStack>
    </Box>
  );
};

export default Card;
