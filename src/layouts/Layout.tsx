import { Outlet } from "react-router-dom";
import Header from "../components/UserComponents/Header";
import Footer from "../components/Common/Home/Footer";


const Layout = () => {
  
    return (
      <>
        <Header/>
          <Outlet/>
        <Footer/>
      </>
    )
}

export default Layout
