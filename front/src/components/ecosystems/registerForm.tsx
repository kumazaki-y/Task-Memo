import { type FC } from 'react';
import { Link } from 'react-router-dom';
import useRegister from '../../features/auth/hooks/register';
import Button from '../atoms/button';
import InputField from '../atoms/inputfield';
import FormContainer from '../molecules/formcontainer';

const RegisterForm: FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    handleRegister,
  } = useRegister();

  return (
    <div>
      <h1>Register</h1>
      <FormContainer onSubmit={handleRegister}>
        <InputField
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter your email"
          error={error}
          autocomplete="username"
        />
        <InputField
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Enter your password"
          error={error}
          autocomplete="new-password"
        />
        <InputField
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          placeholder="Confirm your password"
          error={error}
          autocomplete="confirm-password"
        />
        <Button type="submit" label="Register" />
        <div>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </FormContainer>
    </div>
  );
};

export default RegisterForm;
