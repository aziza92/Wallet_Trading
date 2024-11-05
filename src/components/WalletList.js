import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';
import { getAuth,  signOut  } from 'firebase/auth';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Search, Bell, Settings, Grid, CircleUserRound, ArrowRight } from 'lucide-react';
import {
    theme
  } from './StyledComponents';




  // Fonction pour générer des données statiques
const generateStaticData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Génération de courbes sinusoïdales pour chaque crypto
  const generateSinCurve = (amplitude, offset, frequency) => {
    return months.map((month, index) => {
      const x = (index / 11) * Math.PI * 2 * frequency;
      return offset + amplitude * Math.sin(x);
    });
  };

  const btcValues = generateSinCurve(8, 25, 1.2);  // Courbe BTC
  const ltcValues = generateSinCurve(6, 20, 1.5);  // Courbe LTC
  const ethValues = generateSinCurve(10, 30, 1);   // Courbe ETH

  return months.map((month, i) => ({
    name: month,
    btc: btcValues[i],
    ltc: ltcValues[i],
    eth: ethValues[i]
  }));
};




// Composant principal
export const WalletList = ({ userId }) => {
  const [wallets, setWallets] = useState([]);
  const db = getFirestore();
  const auth = getAuth();


  const staticData = generateStaticData();


  useEffect(() => {
    const fetchWallets = async () => {
      if (!auth.currentUser) return;
      const q = query(collection(db, "wallets"), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      setWallets(querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    };
    fetchWallets();
  }, [auth.currentUser, db]);


  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formattedDateTime = formatDate(currentTime).replace(',', '•');

  // fonction de déconnexion
const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        <Grid size={20} color="#6B6D80" />
        <Settings size={20} color="#6B6D80" />
      </Sidebar>

      <MainContent>
        <Header>
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p style={{ color: '#6B6D80' }}>{formattedDateTime}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <SearchBar>
              <Search color="#6B6D80" size={20} style={{ marginRight: '0.5rem' }} />
              <SearchInput placeholder="Search..." />
            </SearchBar>
            <Bell size={20} color="#6B6D80" />
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          </div>
        </Header>

        <GridContainer>
          <div>
            <CryptoGrid>
              {[
                { symbol: 'BTC', price: '8442.33', change: '+5.23%', color: '#22C55E' },
                { symbol: 'LTC', price: '4786.66', change: '-0.12%', color: '#EC4899' },
                { symbol: 'ETH', price: '8442.33', change: '+0.33%', color: '#3B82F6' }
              ].map((crypto) => (
                <CryptoCard key={crypto.symbol}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span>{crypto.symbol}</span>
                      <span style={{ color: '#6B6D80' }}>• USD</span>
                    </div>
                    <span style={{ color: crypto.change.startsWith('+') ? '#22C55E' : '#EF4444' }}>
                      {crypto.change}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{crypto.price}</div>
                  <ResponsiveContainer width="100%" height={80}>
                    <LineChart data={staticData}>
                      <Line type="monotone" dataKey={crypto.symbol.toLowerCase()} stroke={crypto.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CryptoCard>
              ))}
            </CryptoGrid>

            <MarketOverview>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 'bold' }}>Market Overview</h3>
                <select style={{ background: '#14151F', color: '#6B6D80', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: 'none' }}>
                  <option>Monthly</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={staticData}>
                  <XAxis dataKey="name" stroke="#6B6D80" />
                  <YAxis stroke="#6B6D80" />
                  <Line type="monotone" dataKey="btc" stroke="#22C55E" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ltc" stroke="#EC4899" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="eth" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </MarketOverview>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <GradientCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 'bold' }}>Your Card</h3>
                <ArrowRight size={20} />
              </div>
              <div style={{ opacity: 0.8 }}>**** **** **** 9012</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>1976.88 LTC</div>
            </GradientCard>

            <TransactionCard>
              <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Recent Transactions</h3>
              {[
                { crypto: 'Bitcoin', amount: '42.30', time: '1 min ago' },
                { crypto: 'Ethereum', amount: '66.12', time: '3 min ago' },
                { crypto: 'Litecoin', amount: '17.99', time: '5 min ago' }
              ].map((tx, i) => (
                <TransactionItem key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CircleUserRound size={32} color="#6B6D80" />
                    <div>
                      <div>{tx.crypto}</div>
                      <div style={{ color: '#6B6D80', fontSize: '0.875rem' }}>{tx.time}</div>
                    </div>
                  </div>
                  <div>${tx.amount}</div>
                </TransactionItem>
              ))}
            </TransactionCard>

            <TransactionCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 'bold' }}>Quick Transfer</h3>
                <div style={{ display: 'flex', marginRight: '-0.5rem' }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[#2A2B3F] border-2 border-[#14151F] -ml-2" />
                  ))}
                </div>
              </div>
              <div style={{ color: '#6B6D80', marginBottom: '1rem' }}>$126.5</div>
              <Button>Transfer Now</Button>
            </TransactionCard>

            <TransactionCard style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '0.5rem' }}>🔒</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Be more secure with</div>
              <div style={{ color: '#8B5CF6', fontWeight: 'bold', marginBottom: '1rem' }}>Pro Features</div>
              <button style={{ color: '#8B5CF6', fontSize: '0.875rem', fontWeight: 'bold' }}>
                Upgrade Now!
              </button>
            </TransactionCard>
          </div>
        </GridContainer>
      </MainContent>
    </DashboardContainer>
  );
};


// Styled Components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  color: white;
`;

const Sidebar = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 4rem;
  background: ${theme.colors.cardBg};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0;
  gap: 2rem;
`;

const MainContent = styled.div`
  margin-left: 4rem;
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: ${theme.colors.textSecondary};
  width: 12rem;
  &:focus {
    outline: none;
  }
`;

const CryptoCard = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: 0.75rem;
  padding: 1rem;
`;

const MarketOverview = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const GradientCard = styled.div`
  background: linear-gradient(to right, #EC4899, #8B5CF6, #6366F1);
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const TransactionCard = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
`;

const Button = styled.button`
  width: 100%;
  background: ${theme.colors.purple};
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: ${theme.colors.purpleLight};
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;
`;

const CryptoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const LogoutButton = styled.button`
  background: ${theme.colors.cardBg};
  color: ${theme.colors.textSecondary};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.border};
    color: ${theme.colors.text};
  }
`;
