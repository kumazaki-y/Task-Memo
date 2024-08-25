import { type FC } from 'react';

interface FormContainerProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

const FormContainer: FC<FormContainerProps> = ({ onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit} className="form-container">
      {children}
    </form>
  );
};

export default FormContainer;
