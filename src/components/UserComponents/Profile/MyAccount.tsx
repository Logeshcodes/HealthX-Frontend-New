import { useEffect, useState } from 'react';
import { User, Phone, Mail, CircleDot, Calendar , Store , CalendarDays , HeartPulse , User2 , Ruler , LucideDumbbell , Aperture} from 'lucide-react';
import { getUserData } from '../../../api/action/UserActionApi';

interface UserData {
  username : string;
  email: string;
  mobileNumber: string;
  profilePicture: string;
  isBlocked: string;
  createdAt: string;
  updatedAt: string;

  age : string ;
  gender : string ;
  height : string ;
  weight : string ;
  bloodGroup : string ;
}

const MyAccount = () => {
  const [users, setUsers] = useState<UserData>({
    username: '',
    email: '',
    mobileNumber: '',
    profilePicture : "",
    isBlocked: '',
    createdAt: '',
    updatedAt: '',
    age : '',
    gender : "",
    height : "",
    weight : "",
    bloodGroup : "",
 
  });
  const [loading, setLoading] = useState<boolean>(true);




  
  const [imgSrc, setImgSrc] = useState(
    users.profilePicture || "../../../profile.jpg"
  );

  useEffect(() => {
    if (users?.profilePicture) {
      setImgSrc(users.profilePicture);
      console.log(users.profilePicture , "pic")
    }
  }, [users.profilePicture]);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;
          console.log('user Email:', email);

          if (email) {
            const data = await getUserData(email);
            console.log('users list:', data);
            setUsers(data);
          }
        } else {
          console.log('No user data found in localStorage');
        }
      } catch (error) {
        console.log('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Full Name</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <User size={20} className="text-blue-500" />
                  <span>{users.username}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Phone Number</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <Phone size={20} className="text-blue-500" />
                  <span>{users.mobileNumber}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Email Address</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <Mail size={20} className="text-blue-500" />
                  <span>{users.email}</span>
                </div>
              </div>

             

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Gender</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <User2 size={20} className="text-blue-500" />
                  <span>{users.gender}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Age</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <CalendarDays size={20} className="text-blue-500" />
                  <span>{users.age}</span>
                </div>
              </div>
             
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Weight</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <Ruler size={20} className="text-blue-500" />
                  <span>{users.weight}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Height</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <LucideDumbbell size={20} className="text-blue-500" />
                  <span>{users.height}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Blood Group</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg">
                  <HeartPulse size={20} className="text-blue-500" />
                  <span>{users.bloodGroup}</span>
                </div>
              </div>

                

            
            </div>

            {/* Divider */}

            <div className='h-4'>

            </div>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">*** User Details ***</span>
                </div>
              </div>

            
          </div>

          {/* Right Section */}
          <div className="lg:w-1/3 bg-gray-50 rounded-lg p-6">
            <div className="flex flex-col items-center">
               {/* Show uploaded profile picture or default */}
            <img
              src={imgSrc}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-blue-100"
              onError={(e) => (e.currentTarget.src = "../../../profile.jpg")}
            />

              <h3 className="font-medium text-gray-800">{users.username}</h3>
              {/* <p className="text-gray-500">{doctors.department}</p> */}

              <div className="w-full mt-6 space-y-4">

              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Aperture size={20} className="text-blue-500" />
                    <span className="text-sm">Status</span>
                  </div>
                  <CircleDot size={20} className="text-green-500 ml-12" />
                  {users.isBlocked === 'true' ? (<span> Blocked </span>) : ( <span className='text-green-500 relative'> Active</span>)}
                </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Store size={20} className="text-blue-500" />
                    <span className="text-sm">Joined</span>
                  </div>
                  <span className="text-sm text-gray-600">{new Date(users.createdAt).toLocaleDateString('en-GB')}</span>
                </div>


                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar size={20} className="text-blue-500" />
                    <span className="text-sm">Last Update</span>
                  </div>
                  <span className="text-sm text-gray-600">{new Date(users.updatedAt).toLocaleDateString('en-GB')}</span>
                </div>
               


              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
