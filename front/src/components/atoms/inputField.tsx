import { type FC } from 'react';
import { Input, FormControl, FormErrorMessage } from '@chakra-ui/react';

interface InputFieldProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  autocomplete?: string;
  bg?: string;
}

const InputField: FC<InputFieldProps> = ({
  type,
  value,
  onChange,
  placeholder = '', // デフォルト値を設定
  error = '', // デフォルト値を設定
  autocomplete,
}) => {
  return (
    <FormControl isInvalid={error.trim() !== ''}>
      {' '}
      {/* 明示的な空文字チェック */}
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder !== '' ? placeholder : undefined}
        autoComplete={autocomplete}
        size="md"
      />
      {error.trim() !== '' && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
