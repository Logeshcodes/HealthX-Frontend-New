import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Home, Users, Calendar, Grid, Info,  Shield, DollarSign, ListTodo , ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {  useDispatch } from "react-redux";

import { logout } from '../../api/auth/DoctorAuthentication';


import { setDoctor, clearDoctorDetials } from "../../redux/slices/DoctorSlice";



export default function DoctorHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const [userId, setUserId] = useState<{
    name?: string;
    email?: string;
    role?: string;
    profilePicture?: string;
  } | null>(null);
  


  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const doctorDataString = localStorage.getItem("doctor");
    if (doctorDataString) {
      try {
        const doctorData = JSON.parse(doctorDataString);
        if (doctorData?.email) {
          setUserId(doctorData);
          dispatch(
            setDoctor({
              userId: doctorData.userId,
              name: doctorData.name,
              email: doctorData.email,
              role: doctorData.role,
              isBlocked: doctorData.isBlocked,
              profilePicture: doctorData?.profilePicture || "/default-avatar.png",
            })  
          );
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, [dispatch]);


  const navigation = [
    { name: "Home", href: "/doctor", id: "home", icon: Home },
    { name: "Slots", href: `/doctor/slots/${userId?.email}`, id: "slots", icon: Calendar }, // i want get email here
    { name: "Appointments", href: "/doctor/bookedAppointments", id: "appointments", icon: Users },
    { name: "Service", href: "/doctor/services", id: "services", icon: Grid },
    { name: "About Us", href: "/doctor/about", id: "about", icon: Info },
  ];



  useEffect(() => {
    const currentPath = window.location.pathname;
    const activeNavItem = navigation.find((item) => item.href === currentPath);
    if (activeNavItem) {
      setActiveTab(activeNavItem.id);
    }
  }, []);

  const handleNavigation = (href : any, id : any) => {
    setActiveTab(id);
    navigate(href);
  };

  const handleLogout =  async() => {
    const response = await logout(); 
    dispatch(clearDoctorDetials());
    toast.success(response.message);
    navigate("/doctor/login");
  };


  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8 bg-blue-600">
          <div className="flex lg:flex-1">
            <a href="/doctor" className="-m-1.5 p-1.5">
              <span className="sr-only">HealthX</span>
              <img src="../../../Logo.png" alt="HealthX" className="h-16 w-auto" />
            </a>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map(({ name, href, id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavigation(href, id)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg ${
                  activeTab === id ? "bg-white text-indigo-600" : "text-white hover:bg-indigo-500"
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
                className="flex items-center space-x-2 p-2 rounded-lg"
              >
               <img
                  src={userId?.profilePicture || "/default-avatar.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />

                <ChevronDown size={24} className='mt-8' />
                {/* <span className="text-gray-700">Doctor</span> */}
              </button>



              {/* Dropdown menu */}
              {isOpen && (
                <div className="absolute right-0 mt-96 w-72 bg-gray-800 rounded-lg shadow-lg p-4 z-50 -mb-20">
                  {/* Close button */}
                  <button
                    onClick={toggleDropdown}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
                  >
                    ✕
                  </button>

                  {/* User info section */}
                  <div className="flex items-center space-x-4 mb-6">
                  
                  
                  </div>

                  {/* Menu items */}
                  <div className="space-y-4 mt-8">
                    <a href="/doctor/profile/my-account" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 text-gray-200">
                      <div className="bg-gray-700 p-2 rounded-lg">
                        <DollarSign size={20} className="text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-medium">My Profile</div>
                        <div className="text-sm text-gray-400">Account Settings</div>
                      </div>
                    </a>

                    <a href="/doctor/profile/wallet" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 text-gray-200">
                      <div className="bg-gray-700 p-2 rounded-lg">
                        <Shield size={20} className="text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-medium">Wallet </div>
                        <div className="text-sm text-gray-400">Money Bank </div>
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
              <a href="/doctor/login">
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
          <DialogPanel className="fixed inset-y-0 right-0 w-full bg-blue-600 px-6 py-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-6">
              {navigation.map(({ name, href, id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    handleNavigation(href, id);
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-white hover:bg-indigo-500"
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {name}
                </button>
              ))}
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
}
