import { Outlet } from "react-router-dom";
import DoctorHeader from "../components/DoctorComponents/DoctorHeader";
import Footer from "../components/UserComponents/Footer";

const DoctorLayout = () => {
  
    return (
        <>
        <DoctorHeader />
        <Outlet />
        <Footer />
        </>  
    );
};

export default DoctorLayout;
