import { type FC, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { USER_LOGIN } from 'urls';
import Button from '../atoms/button';
import InputField from '../atoms/inputField';
import FormContainer from '../molecules/formcontainer';

interface AuthResponse {
  'access-token': string;
  client: string;
  uid: string;
}

const LoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(USER_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as AuthResponse;

      if (response.ok) {
        localStorage.setItem('access-token', data['access-token']);
        localStorage.setItem('client', data.client);
        localStorage.setItem('uid', data.uid);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    } catch (error: unknown) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <FormContainer onSubmit={handleLogin}>
        <InputField
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter your email"
          error={error}
        />
        <InputField
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Enter your password"
          error={error}
        />
        <Button type="submit" label="Login" />
        <div>
          <Link to="/register">Register</Link> |{' '}
          <Link to="/password-reset">Forgot Password?</Link>
        </div>
      </FormContainer>
    </div>
  );
};

export default LoginForm;
