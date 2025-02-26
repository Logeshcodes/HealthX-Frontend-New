
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
// import { getChatHistoryById } from '@/api/chatApi';
import { RootState } from '../../../redux/storage';

import { motion } from "framer-motion";
import PrimaryButton from '../button/PrimaryButton';
import { useNavigate } from 'react-router-dom';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

interface Message {
  content: string;
  sender: string;
  senderType: 'User' | 'Doctor';
  createdAt: Date;
}

interface ChatInterfaceProps {
  bookingId: string;
  userId: string;
  doctorId: string;
  slotStartTime: Date;
  slotEndTime: Date;
}

const navigate = useNavigate()


// New interfaces for user types
interface BaseUser {
  userId: string;
  role: 'User' | 'Doctor';
}

interface User extends BaseUser {
  role: 'User';
  // Add User-specific fields here
}

interface Doctor extends BaseUser {
  role: 'Doctor';
  // Add Doctor-specific fields here
}

// Custom hook for getting current user
const useCurrentUser = () => {
  const user = useSelector((state: RootState) => state.user);
  const doctor = useSelector((state: RootState) => state.doctor);
  console.log("User:", user);
  console.log("Doctor:", doctor);
  
  return user.userId?user:doctor
};



const ChatInterface = ({ 
  bookingId, 
  userId, 
  doctorId, 
  slotStartTime, 
  slotEndTime 
}: ChatInterfaceProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = useCurrentUser();
  const [isChatActive, setIsChatActive] = useState(false);
//   const router=useRouter()
  const currentTime = Date.now();
  const startTime = new Date(slotStartTime).getTime();
  const endTime = new Date(slotEndTime).getTime();


  // Validate current user has access to this chat
  useEffect(() => {
    if (!currentUser) return;
    
    const hasAccess = 
      (currentUser.role === 'User' && currentUser.userId === userId) ||
      (currentUser.role === 'Doctor' && currentUser.userId === doctorId);
      // alert(`${currentUser.userId}...${instructorId}`)
      
    if (!hasAccess) {
      console.error('User does not have access to this chat',`${currentUser.userId}--${doctorId}`);
      // Handle unauthorized access - could redirect or show error message
      navigate(-1);
    }
  }, [currentUser, userId, doctorId]);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    
    socketInstance.on('connect', () => {
      console.log('Connected to chat server');
      socketInstance.emit('join-room', bookingId);
    });
    

    socketInstance.on('receive-message', (newMessage: Message) => {
      console.log(newMessage,"new message")
      setMessages(prev => [...prev, newMessage]);
    });

    socketInstance.on('show-typing', (data) =>{ 
      console.log(data,"typing data")
      setIsTyping(true)});
    socketInstance.on('hide-typing', () => setIsTyping(false));

    setSocket(socketInstance);

    // getChatHistoryById(bookingId)
    //   .then((data) => setMessages(data))
    //   .catch((err) => console.error("Error fetching chat history:", err));

    return () => {
      socketInstance.disconnect();
    };
  }, [bookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const now = new Date();
    const start = new Date(slotStartTime);
    const end = new Date(slotEndTime);
    
    setIsChatActive(now >= start && now <= end);
    
    if (now < start) {
      const timeout = setTimeout(() => setIsChatActive(true), start.getTime() - now.getTime());
      return () => clearTimeout(timeout);
    }
  }, [slotStartTime, slotEndTime]);

  const typingFun=()=>{
    console.log("keyup")
    socket?.emit('typing',{roomId:bookingId,userId:currentUser.userId})
  }
  const handleNavigateBack=()=>{
    navigate(-1);
  }

  const sendMessage = () => {
    if (!socket || !message.trim() || !isChatActive || !currentUser) return;

    const messageData = {
      bookingId,
      message: message.trim(),
      sender: currentUser.userId,
      senderType: currentUser.role,
      roomId:bookingId
    };

    socket.emit('send-message', messageData);
    setMessage('');
  };

  const getMessageStyle = (msg: Message) => {
    const isOwnMessage = msg.sender === currentUser?.userId;
    return {
      containerClass: `flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`,
      messageClass: `max-w-[70%] p-3 rounded-lg ${
        isOwnMessage ? 'bg-purple-600 text-white' : 'bg-orange-300'
      }`
    };
  };

  if (!currentUser) {
    return <div className="text-center p-4">Please log in to access the chat.</div>;
  }

  if (!isChatActive) {
    return (
      <div className="flex flex-col space-y-5 items-center justify-center h-64 bg-gray-50 rounded-lg">
        {currentTime < startTime ? (
        // Show "Join at" message if the session hasn't started
        <p className="text-gray-600">
          Join at {format(startTime, 'hh:mm a')}
        </p>
      ) : currentTime > endTime ? (
        // Show "Chat Ended" message if the session has ended
        <p className="text-gray-600">
          Chat Ended at {format(endTime, 'hh:mm a')}
        </p>
      ) : (
        // Show "Join Now" if the session is ongoing
        <p className="text-gray-600 font-semibold text-lg">
          Session is Live! Join Now
        </p>
      )}
        <div onClick={()=>navigate(-1)}>

        <PrimaryButton name={"Return to Bookings"} />
        </div>
        
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Live Chat</h2>
        <p className="text-sm text-gray-500">
          Session ends at {format(new Date(slotEndTime), 'hh:mm a')}
        </p>
        <p className="text-sm text-gray-500">
          Logged in as: {currentUser.role}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const { containerClass, messageClass } = getMessageStyle(msg);
          return (
            <div key={index} className={containerClass}>
              <div className={messageClass}>
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {format(new Date(msg.createdAt), 'hh:mm a')}
                </p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <motion.div
          initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-sm text-black max-w-[10%] rounded-lg  bg-gray-500 p-2 text-wrap">typing...</motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onKeyUp={typingFun}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;