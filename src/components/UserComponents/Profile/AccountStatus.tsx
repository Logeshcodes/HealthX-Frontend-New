import { CheckCircle, Clock } from 'lucide-react';
import { getUserData } from '../../../api/action/UserActionApi';
import { useEffect, useState } from 'react';


interface UserData {
  username: string;
  isBlocked: string;
  createdAt: string;
}

const AccountStatus = () => {


  const [users, setUsers] = useState<UserData>({
    username: "",
    isBlocked: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState<boolean>(true);

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
            console.log('user list:', data);
            setUsers(data);
          }
        } else {
          console.log('No doctor data found in localStorage');
        }
      } catch (error) {
        console.log('Error fetching doctors:', error);
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
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Status</h2>
          <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
            <img
              src="../../../profile.jpg"
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-medium text-gray-800 mb-2">{users.username}</h3>
    

            {users.isBlocked === 'true' ? (
              <div className="flex items-center space-x-2 text-red-500">
                <CheckCircle size={24} />
                <span className="font-medium">Blocked Account</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-green-500">
                <Clock size={24} />
                <span className="font-medium">Active Account</span>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Joined</span>
                <span className="text-sm text-gray-600">{new Date(users.createdAt).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default AccountStatus;
