import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { motion } from 'framer-motion';
import { getAllDepartment, getAllDoctors, getAllUser, getTotalAppointmentDetails , getAllBanner , getAdminData } from '../../api/action/AdminActionApi';


interface User {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
}

interface Doctor {
  _id: string;
  name: string;
  email: string;
  department: string;
  status: string;
  isBlocked: boolean;
}

interface Department {
  _id: string;
  departmentName: string;
  description: string;
}

interface Banner {
  _id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
}

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  status: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

interface RevenueData {
  date: string;
  amount: number;
}

interface DashboardCounts {
  doctorCount: number;
  userCount: number;
  appointmentCount: number;
  bannerCount: number;
  totalRevenue: number;
  activeAppointments: number;
  cancelledAppointments: number;
}

interface Transaction {
  amount: number;
  type: string;
  description: string;
  transactionId: string;
  date: string;
}

interface AdminWallet {
  balance: number;
  transactions: Transaction[];
}


const AdminDashboard: React.FC = () => {
  
  const [loading, setLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<'day' | 'month' | 'year'>('day');
  const [users, setUsers] = useState<User[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts>({
    doctorCount: 0,
    userCount: 0,
    appointmentCount: 0,
    bannerCount: 0,
    totalRevenue: 0,
    activeAppointments: 0,
    cancelledAppointments: 0
  });

  const [doctorsCount, setDoctorsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [adminWallet, setAdminWallet] = useState<AdminWallet | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const transactionsPerPage = 5;
  
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = adminWallet?.transactions.slice(indexOfFirstTransaction, indexOfLastTransaction) || [];
  const totalPages = Math.ceil((adminWallet?.transactions.length || 0) / transactionsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Colors - charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64dff'];

  
  const generateRevenueData = (appointments: Appointment[], filter: 'day' | 'month' | 'year') => {
    if (!appointments || appointments.length === 0) return [];

   
    const groupedData: { [key: string]: number } = {};
    
    appointments.forEach(app => {
      if (app.paymentStatus !== 'success') return;
      
      const date = new Date(app.createdAt);
      let key = '';
      
      if (filter === 'day') {
       
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } else if (filter === 'month') {
        
        key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else {
        
        key = date.getFullYear().toString();
      }
      
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += app.amount;
    });
    
    // Convert array format => chart
    return Object.keys(groupedData).map(date => ({
      date,
      amount: groupedData[date]
    })).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };


  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        
        const usersData = await getAllUser();
        const len = usersData.length;
        setUsersCount(len);
        
        const doctorsData = await getAllDoctors();
        const len2 = doctorsData.length;
        setDoctorsCount(len2);


        const adminData = await getAdminData();
        console.log("Admin Data: ", adminData);
        if (adminData.success && adminData.admin.wallet) {
          setAdminWallet(adminData.admin.wallet);
        }
        
        const departmentsResponse = await getAllDepartment();
       
        const departmentsData = departmentsResponse?.data?.departments || [];
        setDepartments(departmentsData);

        const bannersData = await getAllBanner();
        console.log("Banners: ", bannersData.data);
        setBanners(bannersData.data || []);

        const appointmentsData = await getTotalAppointmentDetails();
        setAppointmentsCount(appointmentsData.totalCount);
        
        setUsers(usersData || []);
        setDoctors(doctorsData || []);
        setAppointments(appointmentsData.data || []);
        
        // Generate revenue - appointments
        const generatedRevenueData = generateRevenueData(appointmentsData.data || [], timeFilter);
        setRevenueData(generatedRevenueData);
        
        calculateDashboardCounts(usersData, doctorsData, appointmentsData.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [timeFilter]);




  

 
  const calculateDashboardCounts = (
    users: User[], 
    doctors: Doctor[], 
    appointments: Appointment[]
  ) => {
    const totalRevenue = appointments.reduce((sum, appointment) => {
      return appointment.paymentStatus === 'success' ? sum + appointment.amount : sum;
    }, 0);

    const activeAppointments = appointments.filter(
      app => app.status === 'booked' || app.status === 'booked'
    ).length;

    const cancelledAppointments = appointments.filter(
      app => app.status === 'cancelled'
    ).length;

    setDashboardCounts({
      doctorCount: doctors.length,
      userCount: users.length,
      appointmentCount: appointments.length,
      bannerCount: banners.length,
      totalRevenue,
      activeAppointments,
      cancelledAppointments
    });
  };

  // => Helper functions
  const prepareUserStatusData = () => {
    const blocked = users.filter(user => user.isBlocked).length;
    const active = users.length - blocked;
    
    return [
      { name: 'Active Users', value: active },
      { name: 'Blocked Users', value: blocked }
    ];
  };

  const prepareDoctorStatusData = () => {
    const approved = doctors.filter(doc => doc.status === 'approved').length;
    const pending = doctors.filter(doc => doc.status === 'pending').length;
    const rejected = doctors.filter(doc => doc.status === 'rejected').length;
    
    return [
      { name: 'Approved', value: approved },
      { name: 'Pending', value: pending },
      { name: 'Rejected', value: rejected }
    ];
  };

  const prepareAppointmentStatusData = () => {
    const booked = appointments.filter(app => app.status === 'booked').length;
    const completed = appointments.filter(app => app.status === 'completed').length;
    const cancelled = appointments.filter(app => app.status === 'cancelled').length;
    
    return [
      { name: 'Booked', value: booked },
      { name: 'Completed', value: completed },
      { name: 'Cancelled', value: cancelled }
    ];
  };

  const prepareDepartmentData = () => {
    if (!departments || departments.length === 0) return [];
  
    return departments
      .map(dept => ({
        name: dept.departmentName,
        doctors: doctors.filter(doc => doc.department === dept.departmentName).length
      }))
      .sort((a, b) => b.doctors - a.doctors); 
  };
  


  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  };

  const cardVariants = {
    hover: { scale: 1.03, transition: { duration: 0.3 } }
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div 
        className="bg-gray-800 rounded-lg p-6 shadow-lg"
        whileHover={cardVariants.hover}
        {...fadeInUp}
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-400 text-sm">Doctor Count</h2>
            <p className="text-3xl font-bold">{doctorsCount}</p>
          </div>
          <div className="bg-indigo-500 h-12 w-12 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-gray-800 rounded-lg p-6 shadow-lg"
        whileHover={cardVariants.hover}
        {...fadeInUp}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-400 text-sm">Users Count</h2>
            <p className="text-3xl font-bold">{usersCount}</p>
          </div>
          <div className="bg-yellow-500 h-12 w-12 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-gray-800 rounded-lg p-6 shadow-lg"
        whileHover={cardVariants.hover}
        {...fadeInUp}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-400 text-sm">Appointmments</h2>
            <p className="text-3xl font-bold">{appointmentsCount}</p>
          </div>
          <div className="bg-green-500 h-12 w-12 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
            whileHover={cardVariants.hover}
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
           <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-400 text-sm">Total Revenue</h2>
                <p className="text-3xl font-bold"> ₹ {dashboardCounts.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-purple-500 h-12 w-12 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

     
    </div>
  );

  
    <motion.div 
      className="bg-gray-800 rounded-lg p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    >
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-4">
        {adminWallet?.transactions.slice(0, 5).map((transaction, index) => (
          <div key={transaction.transactionId || index} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{transaction.description}</h3>
              <p className="text-sm text-gray-400">
                Amount: ₹{transaction.amount} - {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              transaction.type === 'credit' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {transaction.type.toUpperCase()}
            </span>
          </div>
        ))}
        
        {(!adminWallet?.transactions || adminWallet.transactions.length === 0) && (
          <div className="text-center text-gray-400 py-4">
            No recent transactions to display
          </div>
        )}
      </div>
    </motion.div>


  return (
    <div className="admin-dashboard bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="user-profile flex items-center">
            <div className="bg-blue-500 h-10 w-10 rounded-full flex items-center justify-center">
              <span className="text-white">A</span>
            </div>
          </div>
        </motion.div>

        {renderStatsCards()}

        {/* Additional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1.5 gap-6 mb-8">
          <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
            whileHover={cardVariants.hover}
            {...fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Departments</h2>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{departments.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(departments.length * 5, 100)}%` }}></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
            whileHover={cardVariants.hover}
            {...fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Active Banners</h2>
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">{dashboardCounts.bannerCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${Math.min((dashboardCounts.bannerCount / dashboardCounts.appointmentCount || 0) * 100, 100)}%` }}></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
            whileHover={cardVariants.hover}
            {...fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Active Appointments</h2>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">{dashboardCounts.activeAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min((dashboardCounts.activeAppointments / dashboardCounts.appointmentCount || 0) * 100, 100)}%` }}></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
            whileHover={cardVariants.hover}
            {...fadeInUp}
            transition={{ delay: 0.7 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Cancelled Appointments</h2>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{dashboardCounts.cancelledAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${Math.min((dashboardCounts.cancelledAppointments / dashboardCounts.appointmentCount || 0) * 100, 100)}%` }}></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue Graph */}
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Revenue Overview</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeFilter('day')}
                className={`px-3 py-1 rounded-md text-sm ${timeFilter === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Day
              </button>
              <button 
                onClick={() => setTimeFilter('month')}
                className={`px-3 py-1 rounded-md text-sm ${timeFilter === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setTimeFilter('year')}
                className={`px-3 py-1 rounded-md text-sm ${timeFilter === 'year' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Year
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                  labelStyle={{ color: '#eee' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Revenue" 
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ stroke: '#4f46e5', fill: '#4f46e5', r: 3 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-gray-400 text-sm">
            {loading ? "Loading data..." : `Showing revenue data by ${timeFilter}`}
          </div>
        </motion.div>

        {/* Pie Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Status Pie Chart */}
          <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h2 className="text-lg font-medium mb-4 text-center">User Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareUserStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1500}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareUserStatusData().map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                    formatter={(value, name) => [`${value} users`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Doctor Status Pie Chart */}
          <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <h2 className="text-lg font-medium mb-4 text-center">Doctor Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareDoctorStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1500}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareDoctorStatusData().map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                    formatter={(value, name) => [`${value} doctors`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Appointment Status Pie Chart */}
          <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <h2 className="text-lg font-medium mb-4 text-center">Appointment Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareAppointmentStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1500}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareAppointmentStatusData().map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                    formatter={(value, name) => [`${value} appointments`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>



        <h2 className="text-2xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Wallet Overview
          </span>
        </h2>

        <motion.div 
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-xl p-8 mb-8 shadow-xl border border-gray-700/30"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-300 text-lg mb-2">Current Balance</h2>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  ₹ {adminWallet?.balance || 0}
                </span>
                <span className="ml-2 text-green-400 text-sm">Available</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {currentTransactions.map((transaction, index) => (
              <motion.div 
                key={transaction.transactionId || index} 
                className="bg-gradient-to-r from-gray-800 to-gray-700/30 rounded-xl p-4 hover:from-gray-700 hover:to-gray-600/30 transition-all duration-300"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-200">{transaction.description}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      <span className="text-gray-500">Amount:</span> 
                      <span className={transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}>
                        ₹{transaction.amount}
                      </span> 
                      <span className="mx-2">•</span> 
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    transaction.type === 'credit' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {transaction.type.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
            
            {(!adminWallet?.transactions || adminWallet.transactions.length === 0) && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">No recent transactions</div>
                <div className="text-sm text-gray-500">Your transaction history will appear here</div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === 1
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === totalPages
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </motion.div>

      
         {/* Department Summary */}
         <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">Department Overview</h2>
            
            {/* Department Counts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {prepareDepartmentData().map((dept, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-300">{dept.name}</p>
                  <p className="text-lg font-semibold text-blue-400">{dept.doctors} Doctors</p>
                </div>
              ))}
            </div>

       
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareDepartmentData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                    labelStyle={{ color: '#eee' }}
                  />
                  <Legend />
                  <Bar dataKey="doctors" name="Doctors" fill="#8884d8" animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
      </div>
    </div>
  );
};



export default AdminDashboard;