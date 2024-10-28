import { type FC } from 'react';
import { Button as ChakraButton, useColorModeValue } from '@chakra-ui/react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  width?: string;
}

const Button: FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  colorScheme,
  size = 'md',
  isLoading,
  width,
}) => {
  const fallbackColorScheme = useColorModeValue('purple', 'pink');
  const effectiveColorScheme = colorScheme ?? fallbackColorScheme;

  return (
    <ChakraButton
      type={type}
      onClick={onClick}
      colorScheme={effectiveColorScheme}
      size={size}
      width={width ?? '100%'}
      isLoading={isLoading}
    >
      {label}
    </ChakraButton>
  );
};

export default Button;
