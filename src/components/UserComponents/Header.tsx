import { useState, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Home, Users, Calendar, Info, LogIn, ChevronDown, Shield, DollarSign, ListTodo, X, LogOut, UserPen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { logout } from '../../api/auth/UserAuthentication';

import { useDispatch } from "react-redux";

import { setUser, clearUserDetails } from "../../redux/slices/userSlice";

const navigation = [
  { name: 'Home', href: '/', id: 'home', icon: Home },
  { name: "Profile", href: "user/profile/my-account", id: "profile", icon: UserPen },
  { name: 'Doctors', href: '/user/doctor_list', id: 'doctors', icon: Users },
  { name: 'Appointments', href: '/user/appointments', id: 'appointments', icon: Calendar },
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
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const currentPath = window.location.pathname;
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

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-4 md:p-6 lg:p-8 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
          <div className="flex lg:flex-1">
            <a href="/" className="transition-transform hover:scale-105">
              <span className="sr-only">HealthX</span>
              <img
                alt="HealthX"
                src="../../../Logo.png"
                title="HealthX"
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto"
              />
            </a>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-white hover:bg-blue-700 transition-colors"
              aria-label="Open mobile menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-4 xl:gap-x-6">
            {navigation.map(({ name, href, id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavigation(href, id)}
                className={`flex items-center space-x-1 xl:space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  activeTab === id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <Icon className="w-4 h-4 xl:w-5 xl:h-5" />
                <span className="font-medium text-sm xl:text-base">{name}</span>
              </button>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {userId ? (
              <div className="flex items-center gap-2 relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg"
                  aria-label="Open user menu"
                >
                  <img
                    src={imgSrc}
                    alt="Profile"
                    className="w-10 h-10 xl:w-12 xl:h-12 rounded-full object-cover border-2 border-white"
                    onError={() => setImgSrc('../../../profile.jpg')}
                  />
                  <ChevronDown size={20} className="text-white" />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-gray-800 rounded-lg shadow-lg p-4 z-50"
                    >
                      <button
                        onClick={toggleDropdown}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
                        aria-label="Close menu"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-4 mt-2">
                        <a href="/user/profile/my-account" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 text-gray-200">
                          <div className="bg-gray-700 p-2 rounded-lg">
                            <DollarSign size={20} className="text-cyan-400" />
                          </div>
                          <div>
                            <div className="font-medium">My Profile</div>
                            <div className="text-sm text-gray-400">Account Settings</div>
                          </div>
                        </a>

                        <a href="/user/profile/wallet" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 text-gray-200">
                          <div className="bg-gray-700 p-2 rounded-lg">
                            <Shield size={20} className="text-cyan-400" />
                          </div>
                          <div>
                            <div className="font-medium">Wallet</div>
                            <div className="text-sm text-gray-400">Money Bank</div>
                          </div>
                        </a>

                        <a href="#tasks" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 text-gray-200">
                          <div className="bg-gray-700 p-2 rounded-lg">
                            <ListTodo size={20} className="text-yellow-400" />
                          </div>
                          <div>
                            <div className="font-medium">Membership</div>
                            <div className="text-sm text-gray-400">Add up to five members</div>
                          </div>
                        </a>
                      </div>

                      <button
                        className="w-full mt-6 bg-cyan-400 text-white py-3 rounded-lg hover:bg-cyan-500 transition-colors"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <a href="/user/login">
                  <button
                    type="button"
                    className="inline-block px-5 py-2.5 lg:px-6 lg:py-3 font-bold text-center bg-gradient-to-tl from-blue-600 to-cyan-400 uppercase align-middle transition-all rounded-lg cursor-pointer leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs text-white"
                  >
                    Login
                  </button>
                </a>
              </motion.div>
            )}
          </div>
        </nav>

        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-black/30" aria-hidden="true" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-blue-600 px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <a href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">HealthX</span>
                <img alt="HealthX" src="../../../Logo.png" className="h-8 w-auto" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2.5 text-white hover:bg-blue-700"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flow-root">
              <div className="divide-y divide-blue-500/30">
                <div className="space-y-2 py-6">
                  {navigation.map(({ name, href, id, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => {
                        handleNavigation(href, id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center rounded-lg px-3 py-2.5 text-base font-semibold ${
                        activeTab === id
                          ? 'bg-white text-blue-600'
                          : 'text-white hover:bg-blue-700'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {name}
                    </button>
                  ))}
                </div>
                <div className="py-6">
                  {userId ? (
                    <motion.button
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex w-full items-center justify-center rounded-lg px-3 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-5 w-5 text-white" />
                      Logout
                    </motion.button>
                  ) : (
                    <motion.a
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      href="/user/login"
                      className="flex w-full items-center justify-center rounded-lg px-3 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="mr-2 h-5 w-5 text-white" />
                      Login
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
}