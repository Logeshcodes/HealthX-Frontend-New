import { useEffect, useState } from 'react';
import { Card } from '../../Common/card/Card.tsx';
import { Building2, Stethoscope, ActivitySquare, TestTube, ShieldPlus, Hospital, Bone , Ribbon , HeartPulse , ClipboardPlus, Waypoints , Scissors , ShieldCheck , Syringe} from 'lucide-react';
import { motion } from "framer-motion";
import { getDepartmentData } from "../../../api/action/UserActionApi";

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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
        Find By Specialisation
      </h1>

      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 100, x: 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {displayedSpecialists.map((specialist, index) => (
          <Card key={index}>
            <div className="flex flex-col items-center text-center">
              <specialist.icon className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">{specialist.name}</h3>
              <p className="text-sm text-gray-600">{specialist.description}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {specialists.length > 8 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Departments;
