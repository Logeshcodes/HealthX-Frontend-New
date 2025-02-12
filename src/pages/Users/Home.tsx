import Banner from "../../components/UserComponents/Home/Banner";
import DoctorCarousel from "../../components/UserComponents/Home/DoctorCarousel";
import Departments from "../../components/UserComponents/Home/DepartmentList";


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