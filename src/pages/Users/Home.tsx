import Banner from "../../components/UserComponents/Banner";
import DoctorCarousel from "../../components/Common/Home/DoctorCarousel";
import Departments from "../../components/Common/Home/DepartmentList";


const Home = () => {
    return (
      <>
        <Banner />
        <DoctorCarousel/>
        <div className="bg-blue-100 ">
        <Departments/>
        </div>
      </>
    );
  };
  

export default Home