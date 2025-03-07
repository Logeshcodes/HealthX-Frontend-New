import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { getUserData } from '../../../api/action/UserActionApi';



interface ITransaction {
  amount: number;
  type: "credit" | "debit";
  txnid:string;
  description: string;
  transactionId: string;
  date: Date;
}

interface UserInterface extends Document{
    
  username? : string , 
  email : string , 
  mobileNumber? : number , 
  hashedPassword : string , 
  role: string ,
  profilePicture? : string ,
  authenticationMethod : string , 
  isVerified : boolean ,
  isBlocked : boolean ,
  createdAt?: Date ,
  updatedAt? : Date ,
  wallet: {
      balance: number;
      transactions: ITransaction[];
    };
  age? : number ,
  gender? : string ,
  height? : number ,
  weight? : number ,
  bloodGroup? : string ,
}


const WalletPage: React.FC = () => {
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const transactionsPerPage = 1;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;

          if (email) {
            const data = await getUserData(email);
            setUserData(data);
            
          
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Pagination Logic
  const allTransactions = userData?.wallet?.transactions || [];
  const paginatedTransactions = allTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const totalPages = Math.ceil((allTransactions.length || 0) / transactionsPerPage);

  // Format date for transactions
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300"
      >
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600 shadow-2xl"
        ></motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col"
    >
      {/* Glassmorphic Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/40 backdrop-blur-lg shadow-lg p-4 flex justify-between items-center"
      >
        <div className="flex items-center space-x-3">
          <Wallet className="text-blue-700 w-6 h-6" />
          <h1 className="text-xl font-bold text-blue-900 mt-2">My Wallet</h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* <motion.img 
            whileHover={{ scale: 1.1, rotate: 5 }}
            src={imgSrc} 
            alt="Profile" 
            className="w-12 h-12 rounded-full object-cover border-3 border-blue-500 shadow-md"
          /> */}
          <motion.div 
            whileTap={{ scale: 0.9 }}
            className="bg-blue-100/70 p-2 rounded-full hover:bg-blue-200 transition-all"
          >
         
          </motion.div>
        </div>
      </motion.header>

      {/* Balance Card */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 m-4 rounded-2xl shadow-2xl"
      >
        <div className="text-white/80 text-sm mb-2">Total Balance</div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-4xl font-extrabold text-white"
        >
          ₹ {userData?.wallet?.balance?.toLocaleString() || '0.00'}
        </motion.h2>
        <div className="flex justify-between mt-4 space-x-3">
          
          
        </div>
      </motion.div>

      {/* Transactions Section */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/70 backdrop-blur-lg rounded-t-3xl flex-grow p-4 shadow-2xl "
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-blue-900">Recent Transactions</h3>
        </div>
        
        <AnimatePresence>
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction: ITransaction) => (
              <motion.div 
                key={transaction.transactionId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md p-4 mb-3 flex items-center justify-between hover:shadow-lg transition-all"
              >
                <div className="flex items-center space-x-4">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={`p-3 rounded-full ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}
                  >
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="text-green-600" size={20} />
                    ) : (
                      <ArrowUpRight className="text-red-600" size={20} />
                    )}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-blue-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  {
                    transaction.type === 'credit' ? 
                    (
                      <div className='text-green-600 font-bold pl-72'>{transaction.type }</div>
                    ):(
                      <div className='text-red-600 font-bold pl-72'>{transaction.type }</div>
                    )
                  }
                </div>
                <p className={`font-bold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  
                  {transaction.type === 'credit' ? '+' : '-'}
                  ₹{transaction.amount.toLocaleString()}
                </p>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 py-4"
            >
              No transactions found
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-4">
            <motion.button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-100 text-blue-600 rounded-full disabled:opacity-50"
            >
              <ChevronLeft />
            </motion.button>
            <span className="text-blue-800 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <motion.button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-100 text-blue-600 rounded-full disabled:opacity-50"
            >
              <ChevronRight />
            </motion.button>
          </div>
        )}
      </motion.div>

      
    </motion.div>
  );
};

export default WalletPage;