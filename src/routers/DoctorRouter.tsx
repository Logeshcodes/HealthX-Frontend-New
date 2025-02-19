import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import BrickLoader from '../components/Common/Fallbacks/BrickLoader';
import DoctorLogin from '../pages/Doctors/Auth/DoctorLogin';
import DoctorSignup from '../pages/Doctors/Auth/DoctorSignup';
import DoctorHome from '../pages/Doctors/DoctorHome';
import DoctorVerificationOTP from '../pages/Doctors/Auth/DoctorOtpPage';
import DoctorForgotPassword from '../pages/Doctors/Auth/DoctorForgotPassword';
import DoctorResetVerificationOTP from '../pages/Doctors/Auth/DoctorResetVerifyOTP';
import DoctorResetPassword from '../pages/Doctors/Auth/DoctorResetPassword';

import DoctorSessionRoute from '../Protecter/DoctorSessionRouter';

import DoctorLayout from '../layouts/DoctorLayout';
import PrivateRoute from '../Protecter/DoctorPrivateRoute';
import NotFoundPage from '../pages/Doctors/NotFoundPage';

import ProfileManagement from '../components/DoctorComponents/Profile/ProfileManagement';
import MyAccount from '../components/DoctorComponents/Profile/MyAccount';
import ChangePassword from '../components/DoctorComponents/Profile/ChangePassword';
import AccountStatus from '../components/DoctorComponents/Profile/AccountStatus';
import EditProfile from '../components/DoctorComponents/Profile/EditProfile';
import VerifyProfile from '../components/DoctorComponents/Profile/VerifyProfile';

import SlotBooking from '../pages/Doctors/Menu/SlotBooking';



const DoctorRouter =() => {


  return (
    <Suspense fallback={<BrickLoader />}>

      <Routes>


        {/* Auth Routes */}
        <Route path="register" element={<DoctorSignup />} />
        <Route path="verify_otp" element={<DoctorVerificationOTP />} />
        <Route path="login" element={<DoctorSessionRoute><DoctorLogin/></DoctorSessionRoute>} />
        <Route path="verifyEmail" element={<DoctorForgotPassword />} />
        <Route path="forgot-password-otp" element={<DoctorResetVerificationOTP />} />
        <Route path="resetPassword" element={<DoctorResetPassword />} />


       

        {/* Protected Routes with Layout */}
        <Route path="/" element={<DoctorLayout />}>
          <Route path="" element={<DoctorHome />} />
          <Route element={<PrivateRoute />}>
              <Route path="/appointments/:email" element={<SlotBooking/>} />
            <Route path="/profile" element={<ProfileManagement />}>
              <Route path="my-account" element={<MyAccount  />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="account-status" element={<AccountStatus/>} />
              <Route path="verify-profile" element={< VerifyProfile />} />
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
