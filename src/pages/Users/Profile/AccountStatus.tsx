import { CheckCircle, Clock, UserCheck, AlertCircle, Users, UserCircle2Icon, KeyIcon } from 'lucide-react';
import { getUserData } from '../../../api/action/UserActionApi';
import { useEffect, useState } from 'react';

interface UserData {
  username: string;
  role: string;
  isBlocked: string;
  createdAt: string;
  updatedAt: string;
  profilePicture: string;
  authenticationMethod : string ,
}

const AccountStatus = () => {
  const [users, setUsers] = useState<UserData>({
    username: "",
    role: "",
    isBlocked: "",
    createdAt: "",
    updatedAt: "",
    profilePicture: "",
    authenticationMethod: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;

          if (email) {
            const data = await getUserData(email);
            setUsers(data);
          }
        } else {
          setError('No user data found in localStorage');
        }
      } catch (error) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  
  const [imgSrc, setImgSrc] = useState("../../../profile.jpg");

  useEffect(() => {
    if (users?.profilePicture) {
      setImgSrc(users.profilePicture);
    }
  }, [users.profilePicture]);

  const formatDate = (dateString : any) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-white rounded-lg p-6 shadow-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
          <div className="h-3 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex flex-col items-center p-6 bg-red-50 rounded-lg">
          <AlertCircle size={40} className="text-red-500 mb-2" />
          <h3 className="text-lg font-medium text-red-800">{error}</h3>
          <p className="text-red-600 mt-2">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        {/* Background gradient header */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Profile picture overlapping the gradient */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-75 animate-pulse group-hover:opacity-100 transition-all duration-300"></div>
            <img 
              src={imgSrc} 
              alt="Profile" 
              onError={() => setImgSrc("../../../profile.jpg")}
              className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transform transition-all duration-500 hover:scale-105 hover:rotate-3"
            />
          </div>
        </div>
      </div>
      
      {/* Content area with spacing for the overlapping profile picture */}
      <div className="pt-20 pb-6 px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1 animate-fadeIn">
            {users.username || "User"}
          </h2>
          
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 transition-all duration-300">
            {users.isBlocked === 'true' ? (
              <div className="flex items-center space-x-2 text-white bg-red-500 px-3 py-1 rounded-full animate-fadeInUp">
                <CheckCircle size={18} />
                <span>Blocked Account</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-white bg-green-500 px-3 py-1 rounded-full animate-fadeInUp">
                <UserCheck size={18} />
                <span>Active Account</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex items-center p-3 rounded-lg bg-gray-50 transition-all duration-300 hover:bg-gray-100">
              <UserCircle2Icon size={22} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="text-sm font-medium text-gray-800">{users.role}</p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg bg-gray-50 transition-all duration-300 hover:bg-gray-100">
              <Users size={20} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(users.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg bg-gray-50 transition-all duration-300 hover:bg-gray-100">
              <Clock size={20} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Last Update</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(users.updatedAt)}</p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg bg-gray-50 transition-all duration-300 hover:bg-gray-100">
              <KeyIcon size={20} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Authentication Type</p>
                <p className="text-sm font-medium text-gray-800">{users.authenticationMethod}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-gray-50 transition-all duration-300 hover:bg-gray-100">
              <UserCheck size={20} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className={`text-sm font-medium ${users.isBlocked === 'true' ? 'text-red-600' : 'text-green-600'}`}>
                  {users.isBlocked === 'true' ? 'Restricted Access' : 'Full Access'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS animations
const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-in-out;
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out;
}
`;


if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default AccountStatus;