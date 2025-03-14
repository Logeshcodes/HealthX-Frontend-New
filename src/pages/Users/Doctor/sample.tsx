import { Card, CardContent } from "../../../components/AdminComponents/common/Card";
import { CheckCircle, MapPin, Star, StarHalf, MessageSquare, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../components/AdminComponents/common/Button";
import { Mail, Phone, Award, BookOpen, Clock, FileText, Check, Building, Stethoscope, GraduationCap, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDoctorDetails } from "../../../api/action/UserActionApi";

interface Doctor {
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
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  rating: number;
  comment: string;
  timestamp: string;
  likes: number;
  userHasLiked: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  comment: string;
  timestamp: string;
  likes: number;
  userHasLiked: boolean;
}

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [newReply, setNewReply] = useState<Record<string, string>>({});
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      const email = decodeURI(location.pathname.split("/").pop() || "");
      const response = await getDoctorDetails(email);
      setDoctor(response || []);
      
      // Fetch reviews (simulate API call)
      const mockReviews = generateMockReviews();
      setReviews(mockReviews);
      
      // Calculate average rating
      const totalRating = mockReviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(mockReviews.length > 0 ? totalRating / mockReviews.length : 0);
      
      setIsLoading(false);
    };

    fetchDoctors();
  }, []);

  const navigate = useNavigate();

  const bookSlot = () => {
    navigate(`/user/slot/${doctor.email}`);
  };

  const generateMockReviews = (): Review[] => {
    return [
      {
        id: "1",
        userId: "user1",
        userName: "Sarah Johnson",
        userProfilePic: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        comment: "Dr. Smith is an excellent doctor. Very thorough and patient with explanations. Highly recommend!",
        timestamp: "2025-02-15T14:30:00",
        likes: 12,
        userHasLiked: false,
        replies: [
          {
            id: "r1",
            userId: "doc1",
            userName: "Dr. James Smith",
            userProfilePic: "/default-avatar.png",
            comment: "Thank you for your kind words, Sarah! I'm glad I could help.",
            timestamp: "2025-02-15T16:45:00",
            likes: 3,
            userHasLiked: false,
          },
          {
            id: "r2",
            userId: "user5",
            userName: "Michael Brown",
            userProfilePic: "https://randomuser.me/api/portraits/men/22.jpg",
            comment: "I second this! Dr. Smith is amazing.",
            timestamp: "2025-02-16T10:15:00",
            likes: 1,
            userHasLiked: false,
          }
        ]
      },
      {
        id: "2",
        userId: "user2",
        userName: "Robert Wilson",
        userProfilePic: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4,
        comment: "Very professional and knowledgeable. Wait times can be a bit long sometimes.",
        timestamp: "2025-02-10T09:15:00",
        likes: 5,
        userHasLiked: true,
        replies: [
          {
            id: "r3",
            userId: "doc1",
            userName: "Dr. James Smith",
            userProfilePic: "/default-avatar.png",
            comment: "Thank you for your feedback, Robert. We're working on improving our scheduling system to reduce wait times.",
            timestamp: "2025-02-10T11:30:00",
            likes: 2,
            userHasLiked: false,
          }
        ]
      },
      {
        id: "3",
        userId: "user3",
        userName: "Emily Davis",
        userProfilePic: "https://randomuser.me/api/portraits/women/28.jpg",
        rating: 5,
        comment: "Dr. Smith provided excellent care for my chronic condition. The treatment plan has been very effective, and I appreciate the time taken to explain everything clearly. The staff is also very friendly and professional.",
        timestamp: "2025-01-25T13:45:00",
        likes: 8,
        userHasLiked: false,
        replies: [
          {
            id: "r4",
            userId: "doc1",
            userName: "Dr. James Smith",
            userProfilePic: "/default-avatar.png",
            comment: "Thank you, Emily! I'm glad the treatment plan is working well for you.",
            timestamp: "2025-01-25T15:20:00",
            likes: 1,
            userHasLiked: false,
          },
          {
            id: "r5",
            userId: "user7",
            userName: "Jessica Miller",
            userProfilePic: "https://randomuser.me/api/portraits/women/15.jpg",
            comment: "I had a similar experience. The treatment plan was very effective!",
            timestamp: "2025-01-26T09:10:00",
            likes: 0,
            userHasLiked: false,
          },
          {
            id: "r6",
            userId: "user8",
            userName: "Thomas Anderson",
            userProfilePic: "https://randomuser.me/api/portraits/men/5.jpg",
            comment: "Dr. Smith is truly exceptional. I've been to many specialists, but none have taken the time to explain things as clearly.",
            timestamp: "2025-01-26T14:35:00",
            likes: 2,
            userHasLiked: false,
          },
          {
            id: "r7",
            userId: "user9",
            userName: "Amanda Lee",
            userProfilePic: "https://randomuser.me/api/portraits/women/8.jpg",
            comment: "I agree! The detailed explanations really help manage expectations and reduce anxiety.",
            timestamp: "2025-01-27T10:45:00",
            likes: 1,
            userHasLiked: false,
          }
        ]
      }
    ];
  };

  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.comment.trim()) return;
    
    const newReviewObj: Review = {
      id: `review-${Date.now()}`,
      userId: "currentUser",
      userName: "You",
      userProfilePic: "/default-avatar.png",
      rating: newReview.rating,
      comment: newReview.comment,
      timestamp: new Date().toISOString(),
      likes: 0,
      userHasLiked: false,
      replies: []
    };
    
    setReviews([newReviewObj, ...reviews]);
    
    // Recalculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0) + newReview.rating;
    setAverageRating((totalRating) / (reviews.length + 1));
    
    setNewReview({ rating: 0, comment: "" });
  };

  const handleReplySubmit = (reviewId: string) => {
    if (!newReply[reviewId]?.trim()) return;
    
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) return;
    
    const newReplyObj: Reply = {
      id: `reply-${Date.now()}`,
      userId: "currentUser",
      userName: "You",
      userProfilePic: "/default-avatar.png",
      comment: newReply[reviewId],
      timestamp: new Date().toISOString(),
      likes: 0,
      userHasLiked: false
    };
    
    const updatedReviews = [...reviews];
    updatedReviews[reviewIndex].replies.push(newReplyObj);
    setReviews(updatedReviews);
    
    setNewReply({ ...newReply, [reviewId]: "" });
  };

  const toggleReplySection = (reviewId: string) => {
    setShowReplies({ ...showReplies, [reviewId]: !showReplies[reviewId] });
  };

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews({ ...expandedReviews, [reviewId]: !expandedReviews[reviewId] });
  };

  const handleLike = (type: 'review' | 'reply', id: string) => {
    if (type === 'review') {
      const reviewIndex = reviews.findIndex(r => r.id === id);
      if (reviewIndex === -1) return;
      
      const updatedReviews = [...reviews];
      updatedReviews[reviewIndex].userHasLiked = !updatedReviews[reviewIndex].userHasLiked;
      updatedReviews[reviewIndex].likes += updatedReviews[reviewIndex].userHasLiked ? 1 : -1;
      setReviews(updatedReviews);
    } else {
      // Handle reply likes
      const updatedReviews = [...reviews];
      for (let i = 0; i < updatedReviews.length; i++) {
        const replyIndex = updatedReviews[i].replies.findIndex(r => r.id === id);
        if (replyIndex !== -1) {
          updatedReviews[i].replies[replyIndex].userHasLiked = !updatedReviews[i].replies[replyIndex].userHasLiked;
          updatedReviews[i].replies[replyIndex].likes += updatedReviews[i].replies[replyIndex].userHasLiked ? 1 : -1;
          setReviews(updatedReviews);
          break;
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }
    
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="w-5 h-5 text-gray-300" />);
    }
    
    return stars;
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
                  <motion.p 
                    className="text-blue-100 mb-4 text-center flex items-center gap-2 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Stethoscope className="w-5 h-5" />
                    {doctor?.department} Specialist
                  </motion.p>

                  <motion.div 
                    className="w-full space-y-4 text-blue-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
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
                  className="grid grid-cols-2 gap-3 w-full mt-4 mb-16"
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

                {(doctor.consultationType === 'Both' || doctor.consultationType === 'In-Person') && (
                  <div className="p-4 mt-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Location</h3>
                    </div>
                    <p className="text-gray-600">{doctor.location}</p>
                  </div>
                )}

                <motion.div 
                  className="mt-6 flex justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={bookSlot}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-black rounded-lg
                    hover:from-green-600 hover:to-green-700 transition-all duration-200 
                    shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                    flex items-center gap-2 font-medium"
                  >
                    Book Appointment
                  </Button>
                </motion.div>
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
                    <div className="flex">
                      {renderStars(averageRating)}
                    </div>
                    <span className="text-lg font-semibold text-blue-600">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({reviews.length} reviews)</span>
                  </div>
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleReviewSubmit} className="mb-8 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Write a Review</h3>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              newReview.rating >= star 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            } transition-colors duration-200`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Your Review</label>
                    <textarea 
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Share your experience with this doctor..."
                      required
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    disabled={newReview.rating === 0 || !newReview.comment.trim()}
                  >
                    Submit Review
                  </motion.button>
                </form>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <motion.div 
                      key={review.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      {/* Review Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={review.userProfilePic} 
                            alt={review.userName}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                          />
                          <div>
                            <h4 className="font-medium">{review.userName}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-gray-500 text-sm">
                                {formatDate(review.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleLike('review', review.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
                            review.userHasLiked 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {review.likes}
                     
						
						
						
						</button>
                      </div>
                      
                      {/* Review Content */}
                      <div className="mb-3">
                        {review.comment.length > 150 && !expandedReviews[review.id] ? (
                          <>
                            <p className="text-gray-700">{review.comment.substring(0, 150)}...</p>
                            <button 
                              onClick={() => toggleExpandReview(review.id)} 
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
                                onClick={() => toggleExpandReview(review.id)} 
                                className="text-blue-600 text-sm mt-1 hover:underline"
                              >
                                Show less
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      
                      {/* Review Actions */}
                      <div className="mt-3 border-t pt-3">
                        <button 
                          onClick={() => toggleReplySection(review.id)}
                          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {review.replies.length > 0 
                            ? `${review.replies.length} ${review.replies.length === 1 ? 'reply' : 'replies'}` 
                            : 'Reply'}
                          {review.replies.length > 0 && (
                            showReplies[review.id] 
                              ? <ChevronUp className="w-4 h-4" /> 
                              : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      {/* Replies Section */}
                      {showReplies[review.id] && (
                        <div className="mt-4 pl-5 border-l-2 border-gray-200">
                          {/* Show at most 2 replies initially */}
                          {review.replies.slice(0, review.replies.length > 3 && !expandedReviews[`replies-${review.id}`] ? 2 : review.replies.length).map((reply) => (
                            <motion.div
                              key={reply.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mb-3 bg-gray-50 p-3 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={reply.userProfilePic} 
                                    alt={reply.userName}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                                  />
                                  <div>
                                    <h5 className="font-medium text-sm">{reply.userName}</h5>
                                    <span className="text-gray-500 text-xs">
                                      {formatDate(reply.timestamp)}
                                    </span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleLike('reply', reply.id)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                                    reply.userHasLiked 
                                      ? 'bg-blue-100 text-blue-600' 
                                      : 'text-gray-500 hover:bg-gray-100'
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  {reply.likes}
                                </button>
                              </div>
                              <p className="text-gray-700 text-sm">{reply.comment}</p>
                            </motion.div>
                          ))}
                          
                          {/* Show more/less replies toggle */}
                          {review.replies.length > 3 && (
                            <button 
                              onClick={() => setExpandedReviews({
                                ...expandedReviews,
                                [`replies-${review.id}`]: !expandedReviews[`replies-${review.id}`]
                              })}
                              className="text-blue-600 text-sm mb-3 hover:underline flex items-center gap-1"
                            >
                              {expandedReviews[`replies-${review.id}`] ? (
                                <>Show less replies <ChevronUp className="w-4 h-4" /></>
                              ) : (
                                <>Show all {review.replies.length} replies <ChevronDown className="w-4 h-4" /></>
                              )}
                            </button>
                          )}
                          
                          {/* Reply form */}
                          <div className="mt-2 flex gap-2">
                            <input
                              type="text"
                              value={newReply[review.id] || ''}
                              onChange={(e) => setNewReply({
                                ...newReply,
                                [review.id]: e.target.value
                              })}
                              placeholder="Write a reply..."
                              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReplySubmit(review.id)}
                              disabled={!newReply[review.id]?.trim()}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm disabled:bg-blue-300"
                            >
                              Reply
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>


          {/* Review section */}
    </div>
  </div>
);
};

export default DoctorProfile ;