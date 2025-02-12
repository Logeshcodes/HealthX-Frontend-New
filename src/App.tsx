import { Route , Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import DoctorRouter from "./routers/DoctorRouter"


import UserRouter from "./routers/UserRouter"
import AdminRouter from "./routers/AdminRouter"

const App = () => {
  
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path='/*' element={<UserRouter/>}/>
      <Route path='/admin/*' element={<AdminRouter/>}/>
      <Route path='/doctor/*' element={<DoctorRouter/>}/>
    </Routes>
    </>
    
  )

}

export default App