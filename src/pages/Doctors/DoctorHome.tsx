import DoctorBanner from "../../components/DoctorComponents/Banner";
import DoctorCarousel from "../../components/DoctorComponents/DoctorCarousel";
import Departments from "../../components/Common/Home/DepartmentList";



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