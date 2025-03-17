import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, BadgeX, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Card, CardContent, CardHeader } from "../../components/AdminComponents/common/Card";
import { Button } from "../../components/AdminComponents/common/Button";
import LoadingSpinner from "../../components/AdminComponents/LoadingSpinner";

import { getAllBanner, toggleBannerStatus } from "../../api/action/AdminActionApi";

interface Banner {
  _id: string;
  bannerTitle: string;
  link: string;
  role: string;
  isListed: boolean;
  bannerImage: string;
  startDate: string;
  endDate: string;
  description: string;
}

const BannerManagement = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loader, setLoader] = useState(false);

  const fetchBanners = useCallback(async () => {
    try {
      setLoader(true);
      const banner = await getAllBanner();
      setBanners(banner.data);
    } catch (error: any) {
      toast.error(error.message || "Unknown Error Occurred!");
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await toggleBannerStatus(id);
        if (response.success) {
          toast.success(response.message);
          setBanners((prevBanners) =>
            prevBanners.map((banner) =>
              banner._id === id ? { ...banner, isListed: !banner.isListed } : banner
            )
          );
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error.message || "Unknown Error Occurred!");
      }
    },
    [setBanners]
  );

  const handleEdit = (id: string) => {
    navigate(`/admin/editBanner/${id}`);
  };

  return (
    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <Card className="w-full">
          <div className="bg-slate-800 text-white rounded-lg">
            <CardHeader>
              <h1 className="text-2xl font-bold text-blue-500">Banner List</h1>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800 text-white">
                    <tr>
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Title</th>
                      <th className="p-4 text-left">Description</th>
                      <th className="p-4 text-left">Role</th>
                      <th className="p-4 text-left">Start Date</th>
                      <th className="p-4 text-left">Expiry Date</th>
                      <th className="px-20 py-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {banners.map((banner) => (
                      <tr key={banner._id} className="hover:bg-gray-900 bg-slate-800 text-white">
                        <td className="p-4">
                          <img
                            src={banner.bannerImage}
                            alt={banner.bannerTitle}
                            className="w-32 h-20 object-cover rounded"
                          />
                        </td>
                        <td className="p-4">{banner.bannerTitle}</td>
                        <td className="p-4">{banner.description}</td>
                        <td className="p-4">{banner.role}</td>
                        <td className="p-4">
                          {banner.startDate
                            ? new Date(banner.startDate).toLocaleDateString("en-GB")
                            : "No date available"}
                        </td>
                        <td className="p-4">
                          {banner.endDate
                            ? new Date(banner.endDate).toLocaleDateString("en-GB")
                            : "No date available"}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(banner._id)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
                              hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                              shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                              flex items-center gap-2 font-medium"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="ml-1">Edit</span>
                            </button>

                            {banner.isListed ? (
                              <button
                                onClick={() => handleDelete(banner._id)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
                                hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                                shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                                flex items-center gap-2 font-medium"
                              >
                                <BadgeCheck className="h-4 w-4" />
                                <span className="ml-1">Listed</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDelete(banner._id)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-black rounded-lg
                                hover:from-red-600 hover:to-red-700 transition-all duration-200 
                                shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                                flex items-center gap-2 font-medium"
                              >
                                <BadgeX className="h-4 w-4" />
                                <span className="ml-1">Unlisted</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-center">
                <a href="/admin/addBanner">
                  <Button
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-lg
                    hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                    shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                    flex items-center gap-2 font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Banner
                  </Button>
                </a>
              </div>

              <footer className="mt-8 text-sm text-gray-500 flex justify-between"></footer>
            </CardContent>
          </div>
        </Card>
      )}
    </>
  );
};

export default BannerManagement;
