import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Définition des thèmes
export const theme = {
  colors: {
    background: '#1C1E2D',
    cardBg: '#262837',
    border: '#363848',
    text: '#E5E7EB',
    textSecondary: '#9CA3AF',
    purple: '#9333EA',
    purpleLight: '#A855F7'
  }
};

// Styled Components
export const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 28rem;
  background: ${props => props.theme.colors.cardBg};
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;

  &:focus {
    border-color: ${props => props.theme.colors.purple};
    outline: none;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(to right, ${props => props.theme.colors.purple}, ${props => props.theme.colors.purpleLight});
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.purpleLight};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.purple};
  }
`;

export const ErrorText = styled.p`
  color: #EF4444;
  margin-bottom: 1rem;
`;