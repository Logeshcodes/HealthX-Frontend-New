import { Suspense } from 'react';
import { Routes, Route} from 'react-router-dom';
import BrickLoader from '../components/Common/Fallbacks/BrickLoader';


import Home from '../pages/Users/Home';
import SignupPage from '../pages/Users/Auth/Signup';
import LoginPage from '../pages/Users/Auth/Login';
import OTPVerification from "../pages/Users/Auth/verifyOTP";
import ResetVerificationOTP from '../pages/Users/Auth/ResetVerifyOTP';
import ForgotPassword from '../pages/Users/Auth/ForgotPassword';
import ResetPassword from '../pages/Users/Auth/ResetPassword';


import DoctorListingPage from '../pages/Users/Navbar/DoctorList';
import DoctorDetailPage from '../pages/Users/Navbar/DoctorDetailsPage';
import Slot from '../pages/Users/Doctor/Slot';
import SlotDetailsPage from '../pages/Users/Doctor/SlotDetailsPage';

import AppointmentDashboard from '../pages/Users/Navbar/Appoint';
import About from '../pages/Users/Navbar/About';

import Layout from '../layouts/Layout';
import PrivateRoute from '../Protecter/UserPrivateRoute';
import UserSessionRoute from '../Protecter/UserSessionRoute';
import NotFoundPage from '../pages/Users/NotFoundPage';


import ProfileManagement from '../components/UserComponents/Profile/ProfileManagement';
import MyAccount from '../components/UserComponents/Profile/MyAccount';
import ChangePassword from '../components/UserComponents/Profile/ChangePassword';
import EditProfile from '../components/UserComponents/Profile/EditProfile';
import AccountStatus from '../components/UserComponents/Profile/AccountStatus';
import WalletApp from '../components/UserComponents/Profile/Wallet';
import WalletAppointmentConfirmation from '../pages/Users/Doctor/WalletSlotBooking';
import SettingsHelpCenter from '../components/UserComponents/Profile/Settings';

import PaymentSuccess from '../pages/Users/Payment/Success';
import PaymentFailurePage from '../pages/Users/Payment/Failed';


import DoctorProfile from '../pages/Users/Doctor/sample';

const UserRouter = () => {
  return (
    <Suspense fallback={<BrickLoader />}>
      <Routes>

        {/* auth - Unprotected Route  */}

        
        <Route path="/user/signup" element={  <SignupPage />  } />
        <Route path="/user/login" element={<UserSessionRoute><LoginPage /></UserSessionRoute>} />
        <Route path="/user/verify_otp" element={  <OTPVerification /> } />
        <Route path="/user/verifyEmail" element={  <ForgotPassword />  } />
        <Route path="/user/forgot-password-otp" element={ <ResetVerificationOTP />  } />
        <Route path="/user/resetPassword" element={ <ResetPassword /> } />
     

        {/* auth - Unprotected Route  */}



        {/* nav-item */}

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route path="/user/doctor_list" element={<DoctorListingPage />} />
            <Route path="/user/doctor_details/:email" element={<DoctorDetailPage />} />
            <Route path="/user/slot/:email" element={<Slot/>} />
            <Route path="/user/slotDetails/:id" element={<SlotDetailsPage/>} />
            <Route path="/user/walletPayment/:id" element={<WalletAppointmentConfirmation/>} />
            <Route path="/user/appointments" element={<AppointmentDashboard/>} />
            <Route path="/user/about" element={<About />} />
            <Route path="/user/services" element={<DoctorProfile />} />


            {/* Payment */}

            <Route path="/user/patient/payment-success/:txnid" element={<PaymentSuccess />} />
            <Route path="/user/patient/payment-failure" element={<PaymentFailurePage />} />

            {/* Payment */}

           {/* Profile */}
            
            <Route path="/user/profile" element={<ProfileManagement />}>
              <Route path="my-account" element={<MyAccount  />} />
              <Route path="account-status" element={<AccountStatus/>} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="wallet" element={<WalletApp />} />
              <Route path="settings" element={<SettingsHelpCenter/>} />
            </Route>

            {/* profile */}

          </Route>
        </Route>

        {/* nav-item */}
        

        

        {/* Catch-all Route for 404 */}
        <Route path="*" element={<NotFoundPage />} />

        
      </Routes>
    </Suspense>
  );
};

export default UserRouter;
