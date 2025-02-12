import DoctorBanner from "../../components/DoctorComponents/Banner";
import DoctorCarousel from "../../components/UserComponents/Home/DoctorCarousel";
import Departments from "../../components/UserComponents/Home/DepartmentList";



const DoctorHome = () => {
    return (
      <>
      
        <DoctorBanner />
        <DoctorCarousel/>
        <div className="bg-blue-100 ">
        <Departments/>
        </div>
        
      </>
    );
  };
  

export default DoctorHome