import {
  Card,
  CardContent,
} from "../../../components/AdminComponents/common/Card";
import {
  CheckCircle,
  MapPin,
  Star,
  MessageSquare,
  ThumbsUp,
  ChevronUp,
  ChevronDown,
  Flag,
  Calendar,
} from "lucide-react";

import {
  Mail,
  Phone,
  Award,
  BookOpen,
  Clock,
  FileText,
  Check,
  Building,
  Stethoscope,
  GraduationCap,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getDoctorDetails,
  getUserData,
} from "../../../api/action/UserActionApi";
import { toast } from "react-toastify";
import {
  addReply,
  addReview,
  GetDoctorReviews,
  likeReply,
  likeReview,
} from "../../../api/action/DoctorActionApi";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  Mobile: string;
  department: string;
  experience: number;
  role: string;
  education: string;
  description: string;
  consultationType: string;
  profilePicture: string;
  location: string;
}

interface Review {
  _id: string;
  userId: {
    profilePicture: string;
    username: string;
  };
  rating: number;
  createdAt: string;
  comment: string;
  timestamp: string;
  likedBy: string[];
  userHasLiked: boolean;
  replies: Reply[];
}

interface Reply {
  _id: string;
  userId: string;
  userName: string;
  userProfilePicture: string;
  comment: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  userHasLiked: boolean;
  replies: any;
}

interface UserData {
  _id: string;
}

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [averageRating, setAverageRating] = useState(0);
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [newReply, setNewReply] = useState<Record<string, string>>({});
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const [users, setUsers] = useState<UserData>({ _id: "" });
  const navigate = useNavigate();

  const toggleReplySection = (reviewId: string) => {
    setShowReplies({ ...showReplies, [reviewId]: !showReplies[reviewId] });
  };

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews({
      ...expandedReviews,
      [reviewId]: !expandedReviews[reviewId],
    });
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      const email = decodeURI(location.pathname.split("/").pop() || "");
      const response = await getDoctorDetails(email);
      setDoctor(response || []);
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
          const user = JSON.parse(userDataString);
          const email = user?.email;

          if (email) {
            const data = await getUserData(email);
            setUsers(data);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  const bookSlot = () => {
    navigate(`/user/slot/${doctor.email}`);
  };

  const addReport = () => {
    navigate(`/user/addReport/${doctor._id}`);
  };

  const handleLike = async (
    type: "review" | "reply",
    id: string,
    reviewId?: string
  ) => {
    try {
      if (!users._id) {
        toast.error("Please log in to like");
        return;
      }

      if (type === "review") {
        const reviewIndex = reviews.findIndex((review) => review._id === id);
        if (reviewIndex === -1) {
          toast.error("Review not found");
          return;
        }

        const updatedReviews = [...reviews];
        const review = updatedReviews[reviewIndex];

        const hasLiked = review.likedBy.includes(users._id);
        if (hasLiked) {
          review.likedBy = review.likedBy.filter(
            (userId: string) => userId !== users._id
          );
        } else {
          review.likedBy.push(users._id);
        }

        setReviews(updatedReviews);

        const response = await likeReview(id, users._id);
        if (!response.success) {
          toast.error(response.message || "Failed to like review");
          setReviews(reviews);
        }
      } else if (type === "reply" && reviewId) {
        const reviewIndex = reviews.findIndex(
          (review) => review._id === reviewId
        );
        if (reviewIndex === -1) {
          toast.error("Review not found");
          return;
        }

        const updatedReviews = [...reviews];
        const review = updatedReviews[reviewIndex];

        const replyIndex = review.replies.findIndex(
          (reply) => reply._id === id
        );
        if (replyIndex === -1) {
          toast.error("Reply not found");
          return;
        }

        const reply = review.replies[replyIndex];

        const hasLiked = reply.likedBy.includes(users._id);
        if (hasLiked) {
          reply.likedBy = reply.likedBy.filter(
            (userId: string) => userId !== users._id
          );
        } else {
          reply.likedBy.push(users._id);
        }

        setReviews(updatedReviews);

        const response = await likeReply(id, users._id, reviewId);
        if (!response.success) {
          toast.error(response.message || "Failed to like reply");
          setReviews(reviews);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!doctor?._id) {
      toast.error("Doctor information is missing");
      return;
    }
    try {
      const response = await addReview(
        doctor._id,
        users._id,
        newReview.rating,
        newReview.comment
      );

      if (response?.success) {
        setToggeleReview((prev) => !prev);
        toast.success(response.message);
        const updatedReviews = await GetDoctorReviews(doctor._id);
        setReviews(updatedReviews.data.reviews || []);
        setAverageRating(updatedReviews.data.averageRating);
        setNewReview({ rating: 0, comment: "" });
      } else {
        toast.error(response?.message);
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!newReply[reviewId]?.trim()) return;

    try {
      const response = await addReply(reviewId, users._id, newReply[reviewId]);
      console.log("Reply API Response:", response);

      console.log("Reply API Response Id:", response.data.userId);

      if (response?.success) {
        const newReplyObj: Reply = response.data;

        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === reviewId
              ? { ...review, replies: [...newReplyObj.replies] }
              : review
          )
        );

        setNewReply((prev) => ({ ...prev, [reviewId]: "" }));
      } else {
        toast.error(response?.message || "Failed to add reply.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    try {
      const fetchReview = async () => {
        const reviews = await GetDoctorReviews(doctor._id);
        setReviews(reviews.data.reviews || []);
        console.log("avg", reviews.data.averageRating);
        setAverageRating(reviews.data.averageRating);
      };
      fetchReview();
    } catch (error) {
      console.log(error);
    }
  }, [doctor._id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onStarClick?: (rating: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const difference = starValue - rating;
      
      let fillPercentage = "100%";
      if (difference > 0 && difference < 1) {
        // Calculate fill percentage for partial stars
        fillPercentage = `${(1 - difference) * 100}%`;
      }

      return (
        <Star
          key={index}
          className={`h-5 w-5 cursor-pointer ${
            rating >= starValue ? "text-yellow-500" : "text-gray-300"
          }`}
          style={{
            fill: rating >= starValue
              ? "#FFD700"
              : difference < 1
              ? `url(#partialFill-${index})`
              : "none"
          }}
          onClick={() => interactive && onStarClick && onStarClick(starValue)}
        >
          {difference > 0 && difference < 1 && (
            <defs>
              <linearGradient id={`partialFill-${index}`} x1="0" x2="100%" y1="0" y2="0">
                <stop offset={fillPercentage} stopColor="#FFD700" />
                <stop offset={fillPercentage} stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
          )}
        </Star>
      );
    });
  };

  const [toggeleReview, setToggeleReview] = useState(false);

  const handleReviewFormToggle = () => {
    setToggeleReview((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 mt-40">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid md:grid-cols-12 gap-6">
          {/* Left Profile Section */}
          <div className="md:col-span-4">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <motion.div
            className="relative mb-6 group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img
                src={doctor?.profilePicture || "/default-avatar.png"}
                alt="Profile"
                className="max-w-36 h-36 rounded-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "/default-avatar.png")
                }
              />
            </div>

            <motion.div
              className="absolute -bottom-0 right-7 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <CheckCircle className="w-4 h-4" />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-3xl font-bold mb-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {doctor.name}
          </motion.h1>

          {/* Add Rating Display */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex">
              {renderStars(averageRating)}
            </div>
            <span className="text-white font-semibold">
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
            </span>
            <span className="text-blue-100">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </motion.div>

          <motion.p
            className="text-blue-100 mb-4 text-center flex items-center gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Stethoscope className="w-5 h-5" />
            <span className="bg-blue-700/50 px-3 py-1 rounded-full">
              {doctor?.department} Specialist
            </span>
          </motion.p>

          <motion.div
            className="w-full space-y-4 text-blue-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <Mail className="w-5 h-5" />
              <span>{doctor.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Phone className="w-5 h-5" />
              <span>+91 {doctor.Mobile}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Building className="w-5 h-5" />
              <span>{doctor.department}</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-2 gap-3 w-full mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 p-3 bg-white/10 text-white rounded-lg backdrop-blur-sm">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span>{doctor.education}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/10 text-white rounded-lg backdrop-blur-sm">
            <Globe className="w-4 h-4 mr-2" />
            <span>{doctor.consultationType}</span>
          </div>
        </motion.div>
        
        {/* Full-Width Report Button */}
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={addReport}
            className="flex items-center justify-center gap-2 bg-red-800 text-white py-4 px-6 rounded-lg font-semibold shadow-lg border border-blue-400 hover:bg-red-900 transition-all duration-300 w-full"
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.97 }}
          >
            <Flag className="w-5 h-5" />
            Report
          </motion.button>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
</div>

          {/* Right Details Section */}
          <div className="md:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    Professional Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h3 className="font-medium">Experience</h3>
                      </div>
                      <p className="text-gray-600">{doctor.experience} Years</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h3 className="font-medium">Role</h3>
                      </div>
                      <p className="text-gray-600">{doctor.role}</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="font-medium">Description</h3>
                      </div>
                      <p className="text-gray-600">{doctor.description}</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <h3 className="font-medium">Consultation</h3>
                      </div>
                      <p className="text-gray-600">{doctor.consultationType}</p>
                    </div>
                  </div>

                  {(doctor.consultationType === "Both" ||
                    doctor.consultationType === "In-Person") && (
                    <div className="p-4 mt-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="font-medium">Location</h3>
                      </div>
                      <p className="text-gray-600">{doctor.location}</p>
                    </div>
                  )}

            <motion.button
               onClick={bookSlot}
              className="flex items-center justify-center gap-2 bg-blue-800 text-white py-4 px-6 mt-5 rounded-lg font-semibold shadow-lg border border-blue-400 hover:bg-blue-900 transition-all duration-300 w-full"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Calendar className="w-5 h-5" />
              Book Appointment 
            </motion.button>
                </CardContent>
              </Card>

              <Card className="bg-white mt-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-blue-600 mb-4">
                    Language Known
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-6 h-6 text-green-500" />
                        <span className="font-medium">Tamil</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-6 h-6 text-green-500" />
                        <span className="font-medium">English</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-6 h-6 text-green-500" />
                        <span className="font-medium">Malayalam</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Patient Reviews
                </h2>

                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(averageRating)}</div>
                  <span className="text-lg font-semibold text-blue-600">
                    {averageRating}
                  </span>
                  <span className="text-gray-500">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleReviewFormToggle}
                  className="py-2 px-4  bg-purple-500 rounded-lg text-white mb-3 hover:bg-purple-600 flex"
                >
                  {" "}
                  Add Review & Rating{" "}
                </button>
              </div>

              {/* Add Review Form */}
              {toggeleReview && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="mb-8 p-6 bg-white rounded-lg shadow-md"
                >
                  <h4 className="text-xl text-black font-semibold mb-4">
                    Write a Review
                  </h4>
                  <div className="mb-4">
                    <label className="block  text-black mb-2">
                      Your Rating
                    </label>
                    <div className="flex space-x-1">
                      {renderStars(newReview.rating, true, (rating) =>
                        setNewReview((prev) => ({ ...prev, rating }))
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block  text-black mb-2">
                      Your Review
                    </label>
                    <textarea
                      className="w-full  text-black p-2 border rounded-lg"
                      rows={4}
                      placeholder="Share your experience with this course"
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}

              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div>No one Reviewd yet...</div>
                ) : (
                  reviews.map((review) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      {/* Review Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.userId.profilePicture}
                            alt={review.userId.username}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) =>
                              (e.currentTarget.src = "/default-avatar.png")
                            }
                          />
                          <div>
                            <h4 className="font-medium">
                              {review.userId.username}
                            </h4>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-gray-500 text-sm">
                                {formatDate(review?.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleLike("review", review._id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
                            review.likedBy.includes(users._id)
                              ? "bg-blue-100 text-blue-600"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          }}
                        >
                          <motion.div
                            animate={{
                              scale: review.likedBy.includes(users._id)
                                ? [1, 1.2, 1]
                                : 1,
                              rotate: review.likedBy.includes(users._id)
                                ? [0, -10, 10, 0]
                                : 0,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </motion.div>
                          <motion.span
                            animate={{
                              color: review.likedBy.includes(users._id)
                                ? "#2563eb"
                                : "#6b7280",
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            {review.likedBy.length}
                          </motion.span>
                        </motion.button>
                      </div>

                      {/* Review Content */}
                      <div className="mb-3">
                        {review.comment.length > 150 &&
                        !expandedReviews[review._id] ? (
                          <>
                            <p className="text-gray-700">
                              {review.comment.substring(0, 150)}...
                            </p>
                            <button
                              onClick={() => toggleExpandReview(review._id)}
                              className="text-blue-600 text-sm mt-1 hover:underline"
                            >
                              Show more
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="text-gray-700">{review.comment}</p>
                            {review.comment.length > 150 && (
                              <button
                                onClick={() => toggleExpandReview(review._id)}
                                className="text-blue-600 text-sm mt-1 hover:underline"
                              >
                                Show less
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Reply  */}
                      <div className="mt-3 border-t pt-3">
                        <button
                          onClick={() => toggleReplySection(review._id)}
                          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {review.replies.length > 0
                            ? `${review.replies.length} ${
                                review.replies.length === 1
                                  ? "reply"
                                  : "replies"
                              }`
                            : "Reply"}
                          {review.replies.length > 0 &&
                            (showReplies[review._id] ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            ))}
                        </button>
                      </div>
                      {/* Reply  */}

                      {/* Replies Section */}
                      {showReplies[review._id] && (
                        <div className="mt-4 pl-5 border-l-2 border-gray-200">
                          {/* Show at most 2 replies initially */}
                          {review.replies
                            .slice(
                              0,
                              review.replies.length > 3 &&
                                !expandedReviews[`replies-${review._id}`]
                                ? 2
                                : review.replies.length
                            )
                            .map((reply) => (
                              <motion.div
                                key={reply._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mb-3 bg-gray-50 p-3 rounded-lg"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={reply.userProfilePicture}
                                      alt={reply.userName}
                                      className="w-8 h-8 rounded-full object-cover"
                                      onError={(e) =>
                                        (e.currentTarget.src =
                                          "/default-avatar.png")
                                      }
                                    />
                                    <div>
                                      <h5 className="font-medium text-sm">
                                        {reply.userName}
                                      </h5>

                                      <span className="text-gray-500 text-xs">
                                        {formatDate(reply.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                  <motion.button
                                    onClick={() =>
                                      handleLike("reply", reply._id, review._id)
                                    }
                                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
                                      reply.likedBy.includes(users._id) 
                                        ? "bg-blue-100 text-blue-600"
                                        : "text-gray-500 hover:bg-gray-100"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 10,
                                    }} 
                                  >
                                    <motion.div
                                      animate={{
                                        scale: reply.likedBy.includes(users._id)
                                          ? [1, 1.2, 1]
                                          : 1, 
                                        rotate: reply.likedBy.includes(
                                          users._id
                                        )
                                          ? [0, -10, 10, 0]
                                          : 0, 
                                      }}
                                      transition={{ duration: 0.5 }}
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                    </motion.div>
                                    <motion.span
                                      animate={{
                                        color: reply.likedBy.includes(users._id)
                                          ? "#2563eb"
                                          : "#6b7280", 
                                      }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      {reply.likedBy.length}
                                    </motion.span>
                                  </motion.button>
                                </div>
                                <p className="text-gray-700 text-sm">
                                  {reply.comment}
                                </p>
                              </motion.div>
                            ))}

                          {/* Show more/less replies toggle */}
                          {review.replies.length > 3 && (
                            <button
                              onClick={() =>
                                setExpandedReviews({
                                  ...expandedReviews,
                                  [`replies-${review._id}`]:
                                    !expandedReviews[`replies-${review._id}`],
                                })
                              }
                              className="text-blue-600 text-sm mb-3 hover:underline flex items-center gap-1"
                            >
                              {expandedReviews[`replies-${review._id}`] ? (
                                <>
                                  Show less replies{" "}
                                  <ChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  Show all {review.replies.length} replies{" "}
                                  <ChevronDown className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          )}

                          {/* Reply form */}
                          <div className="mt-2 flex gap-2">
                            <input
                              type="text"
                              value={newReply[review._id] || ""}
                              onChange={(e) =>
                                setNewReply({
                                  ...newReply,
                                  [review._id]: e.target.value,
                                })
                              }
                              placeholder="Write a reply..."
                              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReplySubmit(review._id)}
                              disabled={!newReply[review._id]?.trim()}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm disabled:bg-blue-300"
                            >
                              Reply
                            </motion.button>
                          </div>
                        </div>
                      )}
                      {/* Replies Section */}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Existing Reviews */}
            </CardContent>
          </Card>
        </motion.div>

        {/* Review section */}
      </div>
    </div>
  );
};

export default DoctorProfile;
