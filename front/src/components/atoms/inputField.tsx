import { type FC } from 'react';

interface InputFieldProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  autocomplete?: string;
}

const InputField: FC<InputFieldProps> = ({
  type,
  value,
  onChange,
  placeholder,
  error,
  autocomplete,
}) => {
  return (
    <div className="input-field">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error != null && error !== '' ? 'error' : undefined}
        autoComplete={autocomplete}
      />
      {error != null && error !== '' ? (
        <span className="error-message">{error}</span>
      ) : null}
    </div>
  );
};

export default InputField;
