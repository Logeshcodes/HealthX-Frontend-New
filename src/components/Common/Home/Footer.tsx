
import { Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  const clinicServices = [
    'Orthology',
    'Neurology',
    'Dental Care',
    'Ophthalmology',
    'Cardiology'
  ];

  const quickLinks = [
    'About Us',
    'Our Pricing',
    'Our Gallery',
    'Appointment',
    'Privacy Policy'
  ];

  return (
    <footer className="bg-blue-900 text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              
              <img
                  alt=""
                  src="Logo.png"
                  className="h-8 w-auto"
                />
              
              <span className="text-xl font-bold">Health X</span>
            </div>
            <div className="space-y-2">
              <p>Canyon workspace, Thoraipakkam</p>
              <p>TamilNadu - 600097</p>
              <p>+91-88787878787</p>
              <p>info@HealthXCare.com</p>
            </div>
            <div className="flex space-x-4">
              <button className="p-2 bg-white rounded-full hover:bg-blue-100">
                <Facebook className="w-5 h-5 text-blue-900" />
              </button>
              <button className="p-2 bg-white rounded-full hover:bg-blue-100">
                <Twitter className="w-5 h-5 text-blue-900" />
              </button>
              <button className="p-2 bg-white rounded-full hover:bg-blue-100">
                <Youtube className="w-5 h-5 text-blue-900" />
              </button>
              <button className="p-2 bg-white rounded-full hover:bg-blue-100">
                <Linkedin className="w-5 h-5 text-blue-900" />
              </button>
            </div>
          </div>

          {/* Clinic Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Clinic Services</h3>
            <ul className="space-y-2">
              {clinicServices.map((service) => (
                <li key={service}>
                  <button className="hover:text-blue-300 flex items-center">
                    <span className="mr-2">›</span>
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <button className="hover:text-blue-300 flex items-center">
                    <span className="mr-2">›</span>
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-blue-800">
          <p className="text-sm">Copyright ©2025 HealthX.com. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;