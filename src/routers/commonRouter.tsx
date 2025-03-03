import { Suspense } from 'react';
import { Routes, Route} from 'react-router-dom';
import BrickLoader from '../components/Common/Fallbacks/BrickLoader';



import ChatInterface from '../components/Common/Chat/ChatInterface';
import SocketProvider from '../redux/SocketProvider';

const AppointmentRouter = () => {


    return (

        <SocketProvider>
        <Suspense fallback={<BrickLoader />}>
        <Routes>

            
            {/* <Route path="/chat" element={<ChatInterface  />} /> */}

        </Routes>

        </Suspense>
        </SocketProvider>

    )
}

export default AppointmentRouter;