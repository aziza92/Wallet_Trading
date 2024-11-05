import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { WalletList } from './components/WalletList';
import {
  theme
} from './components/StyledComponents';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${ theme.colors.background};
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text};
`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
          <Route path="/" element={user ? <WalletList userId={user.uid} /> : <Navigate to="/login" />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;





///<Route path="/" element={user ? <WalletList userId={user.uid} /> : <Navigate to="/login" />} />
////<Route path="/wallet/:id" element={user ? <WalletDetails /> : <Navigate to="/login" />} />