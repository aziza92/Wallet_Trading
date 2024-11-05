import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

export const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Card>
          <Title>Sign Up</Title>
          {error && <ErrorText>{error}</ErrorText>}
          <form onSubmit={handleSignUp}>
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
            <Button type="submit">Sign Up</Button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: theme.colors.textSecondary }}>
            Already have an account? <StyledLink to="/login">Login</StyledLink>
          </p>
        </Card>
      </Container>
    </ThemeProvider>
  );
};