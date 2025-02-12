import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Card , CardContent , CardHeader ,CardTitle } from '../../components/AdminComponents/common/Card';
import { Button } from '../../components/AdminComponents/common/Button';

const BannerManagement = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      image: "/api/placeholder/300/150",
      title: "Big Shop Days",
      description: "Special offers just for premium deals",
      startDate: "January 25, 2025",
      expiryDate: "April 25, 2025"
    },
    {
      id: 2,
      image: "/api/placeholder/300/150",
      title: "Summer sales",
      description: "Top trending products new deal",
      startDate: "October 30, 2024",
      expiryDate: "November 7, 2024"
    }
  ]);

  const handleDelete = (id : any) => {
    setBanners(banners.filter(banner => banner.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Banners</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">startDate</th>
                <th className="p-4 text-left">ExpiryDate</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-700">
                  <td className="p-4">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">{banner.title}</td>
                  <td className="p-4">{banner.description}</td>
                  <td className="p-4">{banner.startDate}</td>
                  <td className="p-4">{banner.expiryDate}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        
                        
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
            hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
            shadow-md hover:shadow-lg transform hover:-translate-y-0.5
            flex items-center gap-2 font-medium"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="ml-1">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className='px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
            hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
            shadow-md hover:shadow-lg transform hover:-translate-y-0.5
            flex items-center gap-2 font-medium'
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-1">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-center">
          <a href="/admin/addBanner">
          <Button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
            hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
            shadow-md hover:shadow-lg transform hover:-translate-y-0.5
            flex items-center gap-2 font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Add Banner
          </Button>
          </a>
        </div>

        <footer className="mt-8 text-sm text-gray-500 flex justify-between">
          <p>2025 © Health-X - HealthCare Application</p>
          <p>All rights reserved</p>
        </footer>
      </CardContent>
    </Card>
  );
};

export default BannerManagement;