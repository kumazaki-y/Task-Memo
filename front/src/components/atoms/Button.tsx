import { type FC } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // カスタムクラスを適用するためのプロップ
}

const Button: FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  className = '',
}) => {
  return (
    <button type={type} onClick={onClick} className={`btn ${className}`}>
      {label}
    </button>
  );
};

export default Button;
