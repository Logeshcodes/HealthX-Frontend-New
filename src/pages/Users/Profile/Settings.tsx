import { useState } from 'react';
import { 
  Settings, 
  HelpCircle, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  ChevronRight,
  Search,
  ArrowLeft
} from 'lucide-react';

const SettingsHelpCenter = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [activeSettingSection, setActiveSettingSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  
  // Settings sections with their respective options
  const settingsSections = [
    {
      id: 'account',
      icon: <User size={20} />,
      title: 'Account',
      description: 'Manage your account details and preferences',
      options: [
        { id: 'profile', title: 'Profile Information', description: 'Update your name, email and password' },
        { id: 'subscription', title: 'Subscription', description: 'Manage your subscription plan' },
        { id: 'billing', title: 'Billing', description: 'View payment history and update payment methods' }
      ]
    },
    {
      id: 'notifications',
      icon: <Bell size={20} />,
      title: 'Notifications',
      description: 'Control when and how you receive notifications',
      options: [
        { id: 'email', title: 'Email Notifications', description: 'Manage email alert preferences' },
        { id: 'push', title: 'Push Notifications', description: 'Control mobile and desktop alerts' }
      ]
    },
    {
      id: 'privacy',
      icon: <Shield size={20} />,
      title: 'Privacy & Security',
      description: 'Control your data and security settings',
      options: [
        { id: 'privacy', title: 'Privacy Settings', description: 'Manage how your data is used' },
        { id: 'security', title: 'Security', description: 'Two-factor authentication and login history' },
        { id: 'data', title: 'Data Management', description: 'Download or delete your data' }
      ]
    },
    {
      id: 'appearance',
      icon: <Globe size={20} />,
      title: 'Appearance',
      description: 'Customize how the application looks',
      options: [
        { id: 'theme', title: 'Theme', description: 'Switch between light and dark mode' },
        { id: 'language', title: 'Language', description: 'Change the interface language' }
      ]
    }
  ];
  
  // Help center articles
  const helpArticles = [
    { id: 'getting-started', title: 'Getting Started', description: 'Learn the basics of using our platform' },
    { id: 'account-setup', title: 'Setting Up Your Account', description: 'Step-by-step guide to configuring your account' },
    { id: 'billing-faq', title: 'Billing FAQ', description: 'Common questions about billing and subscriptions' },
    { id: 'feature-guide', title: 'Feature Guide', description: 'Detailed instructions for using key features' },
    { id: 'troubleshooting', title: 'Troubleshooting', description: 'Solutions to common problems and issues' },
    { id: 'api-docs', title: 'API Documentation', description: 'Technical guides for developers' }
  ];
  
  // Filter help articles based on search query
  const filteredHelpArticles = helpArticles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <div className={`w-full mt-2 mx-auto p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {activeSettingSection ? settingsSections.find(s => s.id === activeSettingSection)?.title : 
           activeTab === 'settings' ? 'Settings' : 'Help Center'}
        </h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleThemeToggle} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
      
      {/* Main navigation tabs */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'settings' ? 
            (darkMode ? 'border-b-2 border-blue-400 text-blue-400' : 'border-b-2 border-blue-600 text-blue-600') : 
            (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
          onClick={() => {
            setActiveTab('settings');
            setActiveSettingSection(null);
          }}
        >
          <div className="flex items-center">
            <Settings size={16} className="mr-2" />
            Settings
          </div>
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'help' ? 
            (darkMode ? 'border-b-2 border-blue-400 text-blue-400' : 'border-b-2 border-blue-600 text-blue-600') : 
            (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
          onClick={() => {
            setActiveTab('help');
            setActiveSettingSection(null);
          }}
        >
          <div className="flex items-center">
            <HelpCircle size={16} className="mr-2" />
            Help Center
          </div>
        </button>
      </div>
      
      {/* Back button for sub-sections */}
      {activeSettingSection && (
        <button 
          onClick={() => setActiveSettingSection(null)}
          className={`flex items-center mb-4 font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Settings
        </button>
      )}
      
      {/* Settings content */}
      {activeTab === 'settings' && !activeSettingSection && (
        <div className="space-y-4">
          {settingsSections.map((section) => (
            <div 
              key={section.id}
              className={`p-4 rounded-lg flex justify-between items-center cursor-pointer ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{section.description}</p>
                </div>
              </div>
              <ChevronRight size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </div>
          ))}
        </div>
      )}
      
      {/* Settings section detail view */}
      {activeTab === 'settings' && activeSettingSection && (
        <div className="space-y-4">
          {settingsSections
            .find(section => section.id === activeSettingSection)
            ?.options.map(option => (
              <div 
                key={option.id}
                className={`p-4 rounded-lg flex justify-between items-center cursor-pointer ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div>
                  <h3 className="font-medium">{option.title}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{option.description}</p>
                </div>
                <ChevronRight size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
            ))
          }
        </div>
      )}
      
      {/* Help Center content */}
      {activeTab === 'help' && (
        <div>
          {/* Search bar */}
          <div className={`relative mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'
              }`}
            />
          </div>
          
          {/* Help articles */}
          <div className="space-y-4">
            {filteredHelpArticles.length > 0 ? (
              filteredHelpArticles.map(article => (
                <div 
                  key={article.id}
                  className={`p-4 rounded-lg flex justify-between items-center cursor-pointer ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{article.description}</p>
                  </div>
                  <ChevronRight size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </div>
              ))
            ) : (
              <div className={`p-6 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="mb-2 font-medium">No results found</p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Try adjusting your search terms or browse all help articles
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-8 pt-4 border-t">
        <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Need additional help? <a href="#" className={darkMode ? 'text-blue-400' : 'text-blue-600'}>Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default SettingsHelpCenter;