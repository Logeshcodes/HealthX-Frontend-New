import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import BrickLoader from '../components/Common/Fallbacks/BrickLoader';

import DoctorHome from '../pages/Doctors/DoctorHome';
import DoctorLogin from '../pages/Doctors/Auth/DoctorLogin';
import DoctorSignup from '../pages/Doctors/Auth/DoctorSignup';
import DoctorVerificationOTP from '../pages/Doctors/Auth/DoctorOtpPage';
import DoctorResetVerificationOTP from '../pages/Doctors/Auth/DoctorResetVerifyOTP';
import DoctorForgotPassword from '../pages/Doctors/Auth/DoctorForgotPassword';
import DoctorResetPassword from '../pages/Doctors/Auth/DoctorResetPassword';

import DoctorSessionRoute from '../Protecter/DoctorSessionRouter';
import DoctorLayout from '../layouts/DoctorLayout';
import PrivateRoute from '../Protecter/DoctorPrivateRoute';
import NotFoundPage from '../pages/Doctors/NotFoundPage';
import AboutPage from '../components/DoctorComponents/About/AboutPage';

import ProfileManagement from '../components/DoctorComponents/Profile/ProfileManagement';
import MyAccount from '../components/DoctorComponents/Profile/MyAccount';
import ChangePassword from '../components/DoctorComponents/Profile/ChangePassword';
import AccountStatus from '../components/DoctorComponents/Profile/AccountStatus';
import EditProfile from '../components/DoctorComponents/Profile/EditProfile';
import VerifyProfile from '../components/DoctorComponents/Profile/VerifyProfile';

import SlotBooking from '../pages/Doctors/Menu/SlotBooking';
import WalletPage from '../components/DoctorComponents/Profile/Wallet';
import DoctorAppointmentDashboard from '../components/DoctorComponents/Appointments/AppointmentPage';

const DoctorRouter =() => {


  return (
    <Suspense fallback={<BrickLoader />}>
      <Routes>

        {/* Auth Routes */}
        <Route path="login" element={<DoctorSessionRoute><DoctorLogin/></DoctorSessionRoute>} />
        <Route path="register" element={<DoctorSignup />} />
        <Route path="verify_otp" element={<DoctorVerificationOTP />} />
        <Route path="forgot-password-otp" element={<DoctorResetVerificationOTP />} />
        <Route path="verifyEmail" element={<DoctorForgotPassword />} />
        <Route path="resetPassword" element={<DoctorResetPassword />} />

       

        {/* Protected Routes with Layout */}
        <Route path="/" element={<DoctorLayout />}>
          <Route path="" element={<DoctorHome />} />
          <Route element={<PrivateRoute />}>
              <Route path="/slots/:email" element={<SlotBooking/>} />
              <Route path="/bookedAppointments" element={<DoctorAppointmentDashboard/>} />
              <Route path="/about" element={<AboutPage/>} />
            <Route path="/profile" element={<ProfileManagement />}>
              <Route path="my-account" element={<MyAccount  />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="account-status" element={<AccountStatus/>} />
              <Route path="verify-profile" element={< VerifyProfile />} />
              <Route path="wallet" element={< WalletPage />} />
              <Route path="edit-profile" element={<EditProfile />} />
            </Route>
          </Route>
        </Route>



          
        {/* Catch-all Route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
        


      </Routes>
    </Suspense>
  );
};

export default DoctorRouter;
