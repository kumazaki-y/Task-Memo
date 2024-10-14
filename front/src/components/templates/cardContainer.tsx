import { type FC, type ReactNode } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

interface CardContainerProps {
  children: ReactNode;
  isCompleted?: boolean;
}

const CardContainer: FC<CardContainerProps> = ({
  children,
  isCompleted = false,
}) => {
  const bgColor = useColorModeValue(
    isCompleted ? 'gray.200' : 'white',
    isCompleted ? 'gray.600' : 'gray.700',
  );
  const borderColor = useColorModeValue(
    isCompleted ? 'gray.300' : 'purple.100',
    isCompleted ? 'gray.500' : 'gray.600',
  );

  return (
    <Box
      p={4}
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="md"
      boxShadow="sm"
      transition="all 0.3s"
      _hover={{ boxShadow: 'md' }}
    >
      {children}
    </Box>
  );
};

export default CardContainer;
