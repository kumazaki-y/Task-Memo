import { type FC } from 'react';
import { Button as ChakraButton, useColorModeValue } from '@chakra-ui/react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  colorScheme,
  size = 'md',
}) => {
  const fallbackColorScheme = useColorModeValue('purple', 'pink');
  const effectiveColorScheme = colorScheme ?? fallbackColorScheme;

  return (
    <ChakraButton
      type={type}
      onClick={onClick}
      colorScheme={effectiveColorScheme}
      size={size}
      width="100%" // デフォルトでボタン全体を横幅100%に設定
    >
      {label}
    </ChakraButton>
  );
};

export default Button;
