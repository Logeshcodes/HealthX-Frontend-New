import { useState, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Home, Users, Calendar, Grid, Info, LogIn, ChevronDown,   Shield, DollarSign, ListTodo , X } from 'lucide-react';



import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { logout } from '../../api/auth/UserAuthentication';

import {useDispatch } from "react-redux";


import { setUser , clearUserDetails } from "../../redux/slices/userSlice";


const navigation = [
  { name: 'Home', href: '/', id: 'home', icon: Home },
  { name: 'Doctors', href: '/user/doctor_list' , id: 'doctors', icon: Users },
  { name: 'Appointments', href: '/user/appointments', id: 'appointments', icon: Calendar },
  { name: 'Service', href: '/user/services', id: 'services', icon: Grid },
  { name: 'About Us', href: '/user/about', id: 'about', icon: Info },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');




  const [userId, setUserId] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const [profilePicture, setProfilePicture] = useState("");

  const [imgSrc, setImgSrc] = useState('../../../profile.jpg');

  useEffect(() => {
    if (profilePicture) {
      setImgSrc(profilePicture);
    }
  }, [profilePicture]);
  
  
  
  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData?.email) {
          setUserId(userData.email);
          dispatch(setUser({
            userId: userData.userId,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            isBlocked: userData.isBlocked,
            profilePicture: userData.profilePicture,
          }));
        }
        if (userData?.profilePicture) {
          setProfilePicture(userData.profilePicture);
          console.log("pic", userData.profilePicture);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, [dispatch]);
  


  useEffect(() => {
    const currentPath = window.location.pathname;
  
    // Check if current path includes any navigation href
    const activeNavItem = navigation.find((item) => 
      currentPath === item.href || currentPath.startsWith(item.href.replace('/list', ''))
    );
  
    if (activeNavItem) {
      setActiveTab(activeNavItem.id);
    }
  }, []);
  

  const handleNavigation = (href: string, id: string) => {
    setActiveTab(id);
    navigate(href); 
  };
  


  const handleLogout = async () => {
    try {
      await logout(); 
      dispatch(clearUserDetails());
      toast.success("Logged out successfully");
      navigate("/user/login");
    } catch (error: any) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };
  
  

  // const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (



    <div 
    
    
    className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8 bg-blue-600"
        >
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">HealthX</span>
              <img
                alt="HealthX"
                src="../../../Logo.png"
                title="HealthX"
                className="h-16 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map(({ name, href, id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavigation(href, id)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === id
                    ? 'bg-white text-indigo-600'
                    : 'text-white hover:bg-indigo-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </button>
            ))}
          </div>

        


            <div className="hidden lg:flex lg:flex-1 lg:justify-end ">
            {userId ? (
              

              <div className="flex items-center gap-2 mr-14 ">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 p-2 rounded-lg "
              >
               <img
                  src={imgSrc}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                  onError={() => setImgSrc('../../../profile.jpg')}
                />
                <ChevronDown size={24} className='mt-8' />
                {/* <span className="text-gray-700"> User </span> */}
              </button>



              {/* Dropdown menu */}
              {isOpen && (
                <div className="absolute right-0 mt-96 w-72 bg-gray-800 rounded-lg shadow-lg p-4 z-50 -mb-20">
                  {/* Close button */}
                  <button
                    onClick={toggleDropdown}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
                  >
                   <X className="text-gray-400 hover:text-gray-200 cursor-pointer" onClick={toggleDropdown} />

                  </button>

                  {/* User info section */}
                  <div className="flex items-center space-x-4 mb-6">
                  
                  
                  </div>

                  {/* Menu items */}
                  <div className="space-y-4">
                    <a href="/user/profile/my-account" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 text-gray-200">
                      <div className="bg-gray-700 p-2 rounded-lg">
                        <DollarSign size={20} className="text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-medium">My Profile</div>
                        <div className="text-sm text-gray-400">Account Settings</div>
                      </div>
                    </a>

                    <a href="#inbox" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 text-gray-200">
                      <div className="bg-gray-700 p-2 rounded-lg">
                        <Shield size={20} className="text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-medium">My Inbox</div>
                        <div className="text-sm text-gray-400">Messages & Emails</div>
                      </div>
                    </a>

                    <a href="#tasks" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 text-gray-200">
                      <div className="bg-gray-700 p-2 rounded-lg">
                        <ListTodo size={20} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="font-medium">My Tasks</div>
                        <div className="text-sm text-gray-400">To-do and Daily Tasks</div>
                      </div>
                    </a>
                  </div>

                  {/* Logout button */}
                  <button
                    className="w-full mt-6 bg-cyan-400 text-white py-3 rounded-lg hover:bg-cyan-500 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            ) : (
              <a href="/user/login">
                <button
                  type="button"
                  className="mr-3 inline-block px-6 py-3 font-bold text-center bg-gradient-to-tl from-blue-600 to-cyan-400 uppercase align-middle transition-all rounded-lg cursor-pointer leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs text-white"
                >
                  Login
                </button>
              </a>
            )}
          </div>
         
        </nav>

        {/* Mobile Menu */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-blue-600 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">HealthX</span>
                <img alt="HealthX" src="../../../Logo.png" className="h-8 w-auto" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map(({ name, href, id, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => {
                        handleNavigation(href, id);
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-indigo-500"
                    >
                      <Icon className="mr-2 h-5 w-5 text-gray-500" />
                      {name}
                    </button>
                  ))}
                </div>
                <div className="py-6">
                  <a
                   
                    className="flex w-full items-center rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-indigo-500"
                    onClick={handleLogout}
                  >
                    <LogIn className="mr-2 h-5 w-5 text-gray-500" />
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
}
