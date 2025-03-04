// import React, { useState, useRef, useEffect } from "react";
// import { useSocket } from "../../../redux/SocketProvider";
// import {
//   MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdCall
// } from "react-icons/md";

// interface VideoCallModalProps {
//   to: string | undefined;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const configuration = {
//   iceServers: [
//     { urls: "stun:stun.stunprotocol.org" },
//     {
//       urls: "turn:your-turn-server.com",
//       username: "your-username",
//       credential: "your-password",
//     },
//   ],
// };

// const VideoCallModal: React.FC<VideoCallModalProps> = ({ to, isOpen, onClose }) => {
//   const socket = useSocket();
//   const [callState, setCallState] = useState({
//     isCalling: false,
//     isIncomingCall: false,
//     isMuted: false,
//     isVideoOff: false,
//   });
//   const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
//   const peerRef = useRef<RTCPeerConnection | null>(null);

//   useEffect(() => {
//     if (!socket || !isOpen) return;

//     peerRef.current = new RTCPeerConnection(configuration);

//     peerRef.current.onconnectionstatechange = () => {
//       if (peerRef.current?.connectionState === "failed") {
//         handleEndCall();
//       }
//     };

//     peerRef.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     socket.on("incoming:call", (payload) => {
//       console.log("Incoming call payload:", payload);
//       const currentUserEmail = localStorage.getItem("user");
//       if (!currentUserEmail) return;
//       const userData = JSON.parse(currentUserEmail);

//       if (payload.userEmail === userData?.email) {
//         setCallState((prev) => ({ ...prev, isIncomingCall: true }));
//         setIncomingOffer(payload.offer);
//       }
//     });

//     socket.on("incoming:answer", (payload) => {
//       console.log("Incoming answer payload:", payload);
//       if (peerRef.current) {
//         peerRef.current.setRemoteDescription(new RTCSessionDescription(payload.fromAnswer))
//           .catch((error) => console.error("Error setting remote description:", error));
//       }
//     });

//     return () => {
//       socket.off("incoming:call");
//       socket.off("incoming:answer");
//       peerRef.current?.close();
//     };
//   }, [socket, isOpen]);

//   const startVideoCall = async () => {
//     if (!peerRef.current || !socket || !to) return;

//     setCallState((prev) => ({ ...prev, isCalling: true }));

//     try {
//       localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = localStreamRef.current;
//       }

//       localStreamRef.current.getTracks().forEach((track) => {
//         peerRef.current?.addTrack(track, localStreamRef.current!);
//       });

//       const offer = await peerRef.current.createOffer();
//       await peerRef.current.setLocalDescription(offer);

//       socket.emit("outgoing:call", { fromOffer: offer, to });
//     } catch (error) {
//       console.error("Error starting video call:", error);
//       setCallState((prev) => ({ ...prev, isCalling: false }));
//     }
//   };

//   const handleEndCall = () => {
//     if (socket) {
//       socket.emit("end:call", { to });
//     }

//     localStreamRef.current?.getTracks().forEach((track) => track.stop());
//     localStreamRef.current = null;

//     if (peerRef.current) {
//       peerRef.current.ontrack = null;
//       peerRef.current.onconnectionstatechange = null;
//       peerRef.current.close();
//       peerRef.current = null;
//     }

//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = null;
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }

//     setCallState({
//       isCalling: false,
//       isIncomingCall: false,
//       isMuted: false,
//       isVideoOff: false,
//     });

//     setIncomingOffer(null);
//     onClose();
//   };

//   const toggleMute = () => {
//     setCallState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
//     localStreamRef.current?.getAudioTracks().forEach((track) => {
//       track.enabled = !callState.isMuted;
//     });
//   };

//   const toggleVideo = () => {
//     setCallState((prev) => ({ ...prev, isVideoOff: !prev.isVideoOff }));
//     localStreamRef.current?.getVideoTracks().forEach((track) => {
//       track.enabled = !callState.isVideoOff;
//     });
//   };

//   const acceptVideoCall = async (data: { offer: RTCSessionDescriptionInit }) => {

//     console.log("answer button clicked..")
//     if (!peerRef.current || !socket || !to) return;

//     try {
//       await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));

//       const answer = await peerRef.current.createAnswer();
//       await peerRef.current.setLocalDescription(answer);

//       socket.emit("outgoing:answer", { to, fromAnswer: answer });

//       setCallState((prev) => ({ ...prev, isIncomingCall: false, isCalling: true }));
//     } catch (error) {
//       console.error("Error accepting video call:", error);
//       handleEndCall();
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//       <div className="bg-gray-900 rounded-lg shadow-lg p-4 w-full max-w-4xl aspect-video relative">
//         {callState.isIncomingCall && (
//           <div className="flex items-start justify-start bg-green-600 text-white text-xl w-64 font-semibold p-4 rounded-lg shadow-lg animate-pulse">
//             📞 Incoming Call...
//           </div>
//         )}

//         <video ref={remoteVideoRef} autoPlay className="w-full h-full rounded-lg object-cover" />
//         <div className="absolute top-4 right-4 w-32 h-32">
//           <video
//             ref={localVideoRef}
//             autoPlay
//             muted
//             className={`w-full h-full rounded-lg object-cover border-2 ${
//               callState.isVideoOff ? "border-red-500 bg-gray-800" : "border-blue-500"
//             }`}
//           />
//           {callState.isVideoOff && (
//             <div className="absolute inset-0 flex items-center justify-center text-white">
//               Video Off
//             </div>
//           )}
//         </div>
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
//           <button
//             className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
//             onClick={handleEndCall}
//             aria-label="End Call"
//           >
//             <MdCallEnd className="h-5 w-5" />
//           </button>
//           <button
//             className={`p-2 rounded-full ${callState.isMuted ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"}`}
//             onClick={toggleMute}
//             aria-label={callState.isMuted ? "Unmute" : "Mute"}
//           >
//             {callState.isMuted ? <MdMicOff className="h-5 w-5" /> : <MdMic className="h-5 w-5" />}
//           </button>
//           <button
//             className={`p-2 rounded-full ${callState.isVideoOff ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"}`}
//             onClick={toggleVideo}
//             aria-label={callState.isVideoOff ? "Turn Video On" : "Turn Video Off"}
//           >
//             {callState.isVideoOff ? <MdVideocamOff className="h-5 w-5" /> : <MdVideocam className="h-5 w-5" />}
//           </button>

//           {callState.isIncomingCall ? (
//             <button
//               className="bg-yellow-500 text-white p-2 rounded-full hover:bg-green-600"
//               onClick={() => incomingOffer && acceptVideoCall({ offer: incomingOffer })}
//               disabled={callState.isCalling}
//               aria-label="Accept Call"
//             >
//               <MdCall className="h-5 w-5" />
//             </button>
//           ) : (
//             <button
//               className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
//               onClick={startVideoCall}
//               disabled={callState.isCalling}
//               aria-label="Start Call"
//             >
//               <MdCall className="h-5 w-5" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCallModal;
import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../../../redux/SocketProvider";
import {
  MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdCall
} from "react-icons/md";

interface VideoCallModalProps {
  to: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const configuration: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org" },
    {
      urls: "turn:your-turn-server.com",
      username: "your-username",
      credential: "your-password",
    },
  ],
};

const VideoCallModal: React.FC<VideoCallModalProps> = ({ to, isOpen, onClose }) => {
  const socket = useSocket();
  const [callState, setCallState] = useState({
    isCalling: false,
    isIncomingCall: false,
    isMuted: false,
    isVideoOff: false,
    callStatus: "Idle"
  });

  // State to store incoming call offer
  const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Reset all call-related states and close connections
  const resetCallState = () => {
    // Stop local media tracks
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear video sources
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    // Reset state
    setCallState({
      isCalling: false,
      isIncomingCall: false,
      isMuted: false,
      isVideoOff: false,
      callStatus: "Idle"
    });

    // Clear incoming offer
    setIncomingOffer(null);
  };

  // Initialize WebRTC peer connection
  const initializePeerConnection = () => {
    const peerConnection = new RTCPeerConnection(configuration);

    // Handle ICE candidate generation
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice:candidate', { 
          to, 
          candidate: event.candidate 
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      switch(peerConnection.connectionState) {
        case 'connected':
          setCallState(prev => ({ ...prev, callStatus: 'Connected' }));
          break;
        case 'disconnected':
        case 'failed':
          resetCallState();
          onClose();
          break;
      }
    };

    return peerConnection;
  };

  // Set up socket event listeners
  useEffect(() => {
    if (!socket || !isOpen) return;

    // Incoming call handler
    const handleIncomingCall = (payload: any) => {
      console.log("Incoming call payload:", payload);
      setCallState(prev => ({ 
        ...prev, 
        isIncomingCall: true,
        callStatus: 'Incoming Call' 
      }));
      // Store the incoming offer
      setIncomingOffer(payload.offer);
    };

    // ICE candidate handler
    const handleIceCandidate = (payload: any) => {
      if (peerConnectionRef.current && payload.candidate) {
        peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(payload.candidate)
        ).catch(e => console.error('Error adding ICE candidate', e));
      }
    };

    // Call answer handler
    const handleCallAnswer = (payload: any) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(payload.answer)
        ).catch(e => console.error('Error setting remote description', e));
      }
    };

    // Call ended handler
    const handleCallEnded = () => {
      resetCallState();
      onClose();
    };

    // Attach socket listeners
    socket.on('incoming:call', handleIncomingCall);
    socket.on('ice:candidate', handleIceCandidate);
    socket.on('incoming:answer', handleCallAnswer);
    socket.on('call:ended', handleCallEnded);

    // Cleanup listeners
    return () => {
      socket.off('incoming:call', handleIncomingCall);
      socket.off('ice:candidate', handleIceCandidate);
      socket.off('incoming:answer', handleCallAnswer);
      socket.off('call:ended', handleCallEnded);
    };
  }, [socket, isOpen, to, onClose]);

  // Start video call
  const startVideoCall = async () => {
    if (!socket || !to) return;

    try {
      // Initialize peer connection
      peerConnectionRef.current = initializePeerConnection();

      // Get local media stream
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      // Set local video stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      // Add local tracks to peer connection
      localStreamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
      });

      // Create and set local description
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      // Send offer to recipient
      socket.emit('outgoing:call', { 
        to, 
        fromOffer: offer 
      });

      setCallState(prev => ({ 
        ...prev, 
        isCalling: true,
        callStatus: 'Calling' 
      }));

    } catch (error) {
      console.error('Error starting video call:', error);
      resetCallState();
    }
  };

  // Accept incoming video call
  const acceptVideoCall = async () => {
    if (!socket || !to || !incomingOffer) return;
  
    try {
      // Close any existing media streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
  
      // Ensure any existing peer connection is closed
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
  
      // Ensure constraints are correctly specified
      const constraints: MediaStreamConstraints = {
        video: true,  // Use true instead of an empty object
        audio: true
      };
  
      // Get local media stream
      localStreamRef.current = await navigator.mediaDevices.getUserMedia(constraints);
  
      // Initialize peer connection
      peerConnectionRef.current = initializePeerConnection();
  
      // Set local video stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
  
      // Add local tracks to peer connection
      localStreamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
      });
  
      // Set remote description
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(incomingOffer)
      );
  
      // Create and set local description (answer)
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
  
      // Send answer to caller
      socket.emit('call:accepted', { 
        to, 
        answer 
      });
  
      setCallState(prev => ({ 
        ...prev, 
        isIncomingCall: false, 
        isCalling: true,
        callStatus: 'Connected' 
      }));
  
    } catch (error) {
      console.error('Error accepting video call:', error);
      
      // Detailed error handling
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotReadableError':
            alert('Camera or microphone is already in use. Please close other applications.');
            break;
          case 'NotAllowedError':
            alert('Permission to access camera/microphone was denied.');
            break;
          case 'OverconstrainedError':
            alert('Cannot find a camera/microphone that meets the specified constraints.');
            break;
          default:
            alert('An error occurred while trying to start the call.');
        }
      }
  
      resetCallState();
    }
  };


  
  // End call
  const handleEndCall = () => {
    if (socket && to) {
      socket.emit('end:call', { to });
    }
    resetCallState();
    onClose();
  };

  // Toggle audio mute
  const toggleMute = () => {
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    localStreamRef.current?.getAudioTracks().forEach(track => {
      track.enabled = !callState.isMuted;
    });
  };

  // Toggle video
  const toggleVideo = () => {
    setCallState(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }));
    localStreamRef.current?.getVideoTracks().forEach(track => {
      track.enabled = !callState.isVideoOff;
    });
  };

  // Render method
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg p-4 w-full max-w-4xl aspect-video relative">
        {/* Status indicators */}
        {callState.isIncomingCall && (
          <div className="absolute top-4 left-4 bg-green-600 text-white text-xl w-64 font-semibold p-4 rounded-lg shadow-lg animate-pulse">
            📞 Incoming Call...
          </div>
        )}
        {/* <div className="absolute top-16 right-8  text-white text-sm">
           Status: {callState.callStatus}
        </div> */}

        {/* Remote video */}
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          className="w-full h-full rounded-lg object-cover" 
        />

        {/* Local video */}
        <div className="absolute top-4 right-4 w-32 h-32">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className={`w-full h-full rounded-lg object-cover border-2 ${
              callState.isVideoOff ? "border-red-500 bg-gray-800" : "border-blue-500"
            }`}
          />
          {/* {callState.isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              Video Off
            </div>
          )} */}
        </div>

        {/* Call control buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {/* End Call Button */}
          <button
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            onClick={handleEndCall}
            aria-label="End Call"
          >
            <MdCallEnd className="h-5 w-5" />
          </button>

          {/* Mute Toggle Button */}
          <button
            className={`p-2 rounded-full ${callState.isMuted ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"}`}
            onClick={toggleMute}
            aria-label={callState.isMuted ? "Unmute" : "Mute"}
          >
            {callState.isMuted ? <MdMicOff className="h-5 w-5" /> : <MdMic className="h-5 w-5" />}
          </button>

          {/* Video Toggle Button */}
          <button
            className={`p-2 rounded-full ${callState.isVideoOff ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"}`}
            onClick={toggleVideo}
            aria-label={callState.isVideoOff ? "Turn Video On" : "Turn Video Off"}
          >
            {callState.isVideoOff ? <MdVideocamOff className="h-5 w-5" /> : <MdVideocam className="h-5 w-5" />}
          </button>

          {/* Call Action Button */}
          {callState.isIncomingCall ? (
            <button
              className="bg-yellow-500 text-white p-2 rounded-full hover:bg-green-600"
              onClick={acceptVideoCall}
              disabled={callState.isCalling}
              aria-label="Accept Call"
            >
              <MdCall className="h-5 w-5" />
            </button>
          ) : (
            <button
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
              onClick={startVideoCall}
              disabled={callState.isCalling}
              aria-label="Start Call"
            >
              <MdCall className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;