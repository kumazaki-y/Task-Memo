import { type FC } from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Button: FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  colorScheme = 'blue',
  size = 'md',
}) => {
  return (
    <ChakraButton
      type={type}
      onClick={onClick}
      colorScheme={colorScheme}
      size={size}
    >
      {label}
    </ChakraButton>
  );
};

export default Button;
