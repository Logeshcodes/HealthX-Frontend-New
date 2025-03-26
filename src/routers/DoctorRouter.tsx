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
import About from '../pages/Doctors/Navbar/About';

import ProfileManagement from '../pages/Doctors/Profile/ProfileManagement';
import MyAccount from '../pages/Doctors/Profile/MyAccount';
import ChangePassword from '../pages/Doctors/Profile/ChangePassword';
import AccountStatus from '../pages/Doctors/Profile/AccountStatus';
import EditProfile from '../pages/Doctors/Profile/EditProfile';
import VerifyProfile from '../pages/Doctors/Profile/VerifyProfile';

import SlotBooking from '../pages/Doctors/Navbar/SlotBooking';
import WalletPage from '../pages/Doctors/Profile/Wallet';
import DoctorAppointmentDashboard from '../pages/Doctors/Navbar/AppointmentPage';
import DoctorPrescriptionForm from '../pages/Doctors/Appointments/AddPrescription';
import PrescriptionSuccessPage from '../pages/Doctors/Appointments/PrescriptionSuccess';
import DoctorDashboard from '../pages/Doctors/Navbar/DoctorDashboard';
import PrescriptionDetails from '../pages/Users/Doctor/Prescription';
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
              <Route path="/prescription/:appointmentId" element={<DoctorPrescriptionForm/>} />
              <Route path="/prescription/Success" element={<PrescriptionSuccessPage/>} />
              <Route path="/viewPrescription/:appointmentId" element={<PrescriptionDetails/>} />
              <Route path="/about" element={<About/>} />
              <Route path="dashboard" element={< DoctorDashboard />} />
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
