import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const WalletDetails = ({ walletId }) => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      const walletDoc = await getDoc(doc(db, "wallets", walletId));
      setWallet({ id: walletDoc.id, ...walletDoc.data() });

      const q = query(collection(db, "transactions"), where("walletId", "==", walletId));
      const querySnapshot = await getDocs(q);
      setTransactions(querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    };

    fetchWalletData();
  }, [walletId]);

  if (!wallet) return <div>Chargement...</div>;

  return (
    <div className="ml-16 p-6 text-white">
      <div className="bg-[#1C1D2D] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Wallet Details</h2>
        <div className="bg-[#14151F] p-4 rounded-xl mb-6">
          <h3 className="font-bold text-xl">{wallet?.name}</h3>
          <p className="text-2xl font-bold text-green-500">Balance: {wallet?.balance}</p>
        </div>

        <h3 className="text-xl font-bold mb-4">Transactions</h3>
        <div className="space-y-2">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-[#14151F] p-4 rounded-xl">
              <p className="font-bold">{tx.amount}</p>
              <p className="text-[#6B6D80]">{tx.description}</p>
              <p className="text-sm text-[#6B6D80]">
                {tx.date.toDate().toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};