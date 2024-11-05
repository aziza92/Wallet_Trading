import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ThemeProvider } from 'styled-components';
import {
  Container,
  Card,
  Title,
  Input,
  Button,
  StyledLink,
  ErrorText,
  theme
} from './StyledComponents';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
    <Container>
      <Card>
        <Title>Login</Title>
        {error && <ErrorText>{error}</ErrorText>}
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button type="submit">Login</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: theme.colors.textSecondary }}>
          No account? <StyledLink to="/signup">Sign up</StyledLink>
        </p>
      </Card>
    </Container>
  </ThemeProvider>
  );
};