import { useEffect, useState } from 'react';
import { Card } from '../card/Card.tsx';
import { Building2, Stethoscope, ActivitySquare, TestTube, ShieldPlus, Hospital, Bone , Ribbon , HeartPulse , ClipboardPlus, Waypoints , Scissors , ShieldCheck , Syringe} from 'lucide-react';
import { motion } from "framer-motion";
import { getDepartmentData } from "../../../api/action/UserActionApi.tsx";

interface Department {
  departmentName: string;
}

const Departments = () => {
  const [showAll, setShowAll] = useState(false);
  const [department, setDepartment] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartmentData();
        console.log(response.departments);
        setDepartment(response.departments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Icon mapping for departments
  const departmentIconMap: { [key: string]: any } = {
    'General Medicine': ShieldPlus,
    'Primary Care': Stethoscope,
    'Cardiologist': HeartPulse,
    'Radiologist': ActivitySquare,
    'Hematologist': TestTube,
    'Homeopathic': Hospital,
    'Orthopedist': Bone,
    'Neurologist': Waypoints,
    'Dermatologist': Stethoscope,
    'ENT Specialist': ActivitySquare,
    "Physiologist" :  Building2,
    "Piscologist" : Ribbon,
    "Orthologist" : ClipboardPlus,
    "Orthopedic Surgeon" : Scissors ,
    "Dentist" : ShieldCheck,
    "Pediatrician" : Syringe ,

  };

  // Create specialists dynamically based on department data
  const specialists = department.map((dept) => ({
    icon: departmentIconMap[dept.departmentName] || Building2, // Fallback icon
    name: dept.departmentName,
    description: `${dept.departmentName} specialist`,
  }));

  const displayedSpecialists = showAll ? specialists : specialists.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
      >
        Find By Specialisation
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {displayedSpecialists.map((specialist, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 hover:bg-blue-50/50">
              <div className="flex flex-col items-center text-center p-6 space-y-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <specialist.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{specialist.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{specialist.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {specialists.length > 8 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Departments;
