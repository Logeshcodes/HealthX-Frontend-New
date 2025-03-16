import { CheckCircle, Home, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PrescriptionSuccessPage = () => {

    const navigate = useNavigate()

    const handleAppointment = () => {
        navigate(`/doctor/bookedAppointments`);
    };
    const handleHome = () => {
        navigate(`/doctor`);
    };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 mt-12">
      <motion.div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-10">
          <div className="flex justify-center">
            <motion.div
              className="bg-white rounded-full p-5 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
          </div>
        </div>
        
        <div className="p-10">
          <motion.h1 
            className="text-4xl font-bold text-center text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Prescription Added Successfully!
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            The prescription has been successfully added to the patient's record.
          </motion.p>
          
          <div className="space-y-6">
            <motion.div 
              className="p-6 bg-green-50 rounded-lg border border-green-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-green-800">Prescription Details</h3>
                  <p className="text-base text-green-700">Patient will receive the prescription details via email.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={handleHome}
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg text-lg font-medium transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Home className="w-6 h-6" />
                <span>Go to Home Page</span>
              </motion.button>
              
              <motion.button
                onClick={handleAppointment}
                className="flex items-center justify-center gap-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 px-6 rounded-lg text-lg font-medium transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-6 h-6" />
                <span>View Appointments</span>
              </motion.button>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
           
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrescriptionSuccessPage;