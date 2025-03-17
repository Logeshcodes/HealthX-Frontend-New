import React, { useState, useEffect } from 'react';
import { addPrescription, getAppointmentById } from '../../../api/action/DoctorActionApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionData {
  doctorId: string;
  patientId: string;
  appointmentId: string;
  prescriptionDate: string;
  medications: Medication[];
  diagnosis: string;
  notes: string;
}

interface PrescriptionFormProps {
  initialData?: PrescriptionData;
  onSubmit?: (data: PrescriptionData) => void;
  onCancel?: () => void;
}

const defaultMedication: Medication = {
  name: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: ''
};

const frequencyOptions = [
  'Once a day',
  'Twice a day',
  'Three times a day',
  'Four times a day',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'As needed',
  'Other'
];

const DoctorPrescriptionForm: React.FC<PrescriptionFormProps> = ({
  initialData,
  onCancel
}) => {
  const [formData, setFormData] = useState<PrescriptionData>({
    doctorId: initialData?.doctorId || '',
    patientId: initialData?.patientId || '',
    appointmentId: initialData?.appointmentId || '',
    prescriptionDate: initialData?.prescriptionDate ? 
      new Date(initialData.prescriptionDate).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    medications: initialData?.medications?.length ? 
      initialData.medications : 
      [{ ...defaultMedication }],
    diagnosis: initialData?.diagnosis || '',
    notes: initialData?.notes || ''
  });


  const navigate = useNavigate()

  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { ...defaultMedication }]
    });
  };

  const removeMedication = (index: number) => {
    if (formData.medications.length === 1) {
      return; // Keep at least one medication
    }
    
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const [loading, setLoading] = useState(false);

const handleSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  if (loading) return; 
  
  setLoading(true); 

  console.log("Submitting prescription data...");
  
  const submissionData = {
    ...formData,
    prescriptionDate: new Date(formData.prescriptionDate).toISOString()
  };

  try {
    const response = await addPrescription(submissionData);

    if (response.success) {
      toast.success(response.message);
      navigate(`/doctor/prescription/Success`)
    } else {
      toast.error(response.message || "Failed to add prescription");
    }
  } catch (error) {
    toast.error("An unexpected error occurred");
  } finally {
    setLoading(false); // Stop loading
  }
};

  

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  useEffect(() => {
    const appointmentId = decodeURI(location.pathname.split('/').pop() || '');
  
    const fetchAppointments = async () => {
      try {
        const response = await getAppointmentById(appointmentId);
  
        if (response.success) {
  
          setFormData((prevData) => ({
            ...prevData,
            doctorId: response.data.doctorId || '',
            patientId: response.data.patientId || '',
            appointmentId: response.data._id || '',
          }));
        } else {
          toast.error(response?.message || 'Appointment Data Not Found');
        }
      } catch (error) {
        toast.error('Error fetching appointment data');
      }
    };
  
    fetchAppointments();
  }, []);
  

  return (
    <div className="max-w-6xl mx-auto p-4 mt-32">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h1 className="text-2xl font-bold text-white text-center">Doctor Prescription Form</h1>
        </div>

        {!showPreview ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID</label>
                <input
                  type="text"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData?.patientId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
                <input
                  type="text"
                  name="appointmentId"
                  value={formData.appointmentId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Date</label>
                <input
                  type="date"
                  name="prescriptionDate"
                  value={formData.prescriptionDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                rows={3}
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">Medications</h2>
                <button
                  type="button"
                  onClick={addMedication}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Add Medicine
                </button>
              </div>
              
              {formData.medications.map((med, index) => (
                <div key={index} className="p-4 border rounded-lg mb-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                      <select
                        value={med.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        className="w-full p-2 h-16 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                        required
                      >
                        <option value="">Select frequency</option>
                        {frequencyOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                   
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                      <textarea
                        value={med.instructions}
                        onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                        rows={2}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      disabled={formData.medications.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              )}
              
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Preview
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Save Prescription
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="border-b-2 border-gray-300 pb-4 mb-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Prescription</h2>
                  <p className="text-gray-600">Date: {formatDate(formData.prescriptionDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Doctor ID: {formData.doctorId}</p>
                  <p className="text-gray-600">Patient ID: {formData.patientId}</p>
                  <p className="text-gray-600">Appointment ID: {formData.appointmentId}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Diagnosis</h3>
              <p className="bg-gray-50 p-3 rounded">{formData.diagnosis}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Medications</h3>
              {formData.medications.map((med, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="font-semibold">Name:</span> {med.name}
                    </div>
                    <div>
                      <span className="font-semibold">Dosage:</span> {med.dosage}
                    </div>
                    <div>
                      <span className="font-semibold">Frequency:</span> {med.frequency}
                    </div>
                    <div>
                      <span className="font-semibold">Duration:</span> {med.duration}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold">Instructions:</span> {med.instructions}
                  </div>
                </div>
              ))}
            </div>
            
            {formData.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
                <p className="bg-gray-50 p-3 rounded">{formData.notes}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
              >
                Edit
              </button>
              
              <button
              type="button"
              onClick={() => handleSubmit()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Confirm & Save
            </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescriptionForm;
            