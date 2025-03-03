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

const configuration = {
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
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!socket || !isOpen) return;

    peerRef.current = new RTCPeerConnection(configuration);

    peerRef.current.onconnectionstatechange = () => {
      if (peerRef.current?.connectionState === "failed") {
        handleEndCall();
      }
    };

    peerRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    socket.on("incoming:call", (payload) => {
      console.log("Incoming call payload:1", payload);
      const currentUserEmail=localStorage.getItem("user")
      if(!currentUserEmail) return
      const userData=JSON.parse(currentUserEmail)

      if(payload.userEmail==userData?.email){

        setCallState((prev) => ({ ...prev, isIncomingCall: true }));
      }
    });

    socket.on("incoming:answer", (payload) => {
      console.log("Incoming answer payload:", payload);
    });

    return () => {
      socket.off("incoming:call");
      socket.off("incoming:answer");
      peerRef.current?.close();
    };
  }, [socket, isOpen]);

  const startVideoCall = async () => {
    if (!peerRef.current || !socket || !to) return;

    setCallState((prev) => ({ ...prev, isCalling: true }));

    try {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      localStreamRef.current.getTracks().forEach((track) => {
        peerRef.current?.addTrack(track, localStreamRef.current!);
      });

      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);

      socket.emit("outgoing:call", { fromOffer: offer, to });
    } catch (error) {
      console.error("Error starting video call:", error);
      setCallState((prev) => ({ ...prev, isCalling: false }));
    }
  };




  const handleEndCall = () => {
    if (socket) {
      socket.emit("end:call", { to });
    }

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onconnectionstatechange = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setCallState({
      isCalling: false,
      isIncomingCall: false,
      isMuted: false,
      isVideoOff: false,
    });

    onClose();
  };

  const toggleMute = () => {
    setCallState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !callState.isMuted;
    });
  };

  const toggleVideo = () => {
    setCallState((prev) => ({ ...prev, isVideoOff: !prev.isVideoOff }));
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = !callState.isVideoOff;
    });
  };

   const acceptVideoCall = async (data: {
      offer: RTCSessionDescriptionInit;
    }) => {
      if (
        !peerRef.current ||
        peerRef.current.signalingState !== "have-local-offer"
      ) {
        console.warn(
          "Cannot process answer in current state:",
          peerRef.current?.signalingState
        );
        return;
      }

      try {
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
      } catch (error) {
        console.error("Error setting remote description:", error);
        handleEndCall();
      }
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg p-4 w-full max-w-4xl aspect-video relative">
        {callState.isIncomingCall ? (
          <div className="text-white text-xl">Incoming call...</div>
        ) : (
          <div className="text-white text-xl">No Incoming Call</div>
        )}

        <video ref={remoteVideoRef} autoPlay className="w-full h-full rounded-lg object-cover" />
        <div className="absolute top-4 right-4 w-32 h-32">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className={`w-full h-full rounded-lg object-cover border-2 ${
              callState.isVideoOff ? "border-red-500 bg-gray-800" : "border-blue-500"
            }`}
          />
          {callState.isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              Video Off
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            onClick={handleEndCall}
            aria-label="End Call"
          >
            <MdCallEnd className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-full ${callState.isMuted ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"}`}
            onClick={toggleMute}
            aria-label={callState.isMuted ? "Unmute" : "Mute"}
          >
            {callState.isMuted ? <MdMicOff className="h-5 w-5" /> : <MdMic className="h-5 w-5" />}
          </button>
          <button
            className={`p-2 rounded-full ${callState.isVideoOff ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"}`}
            onClick={toggleVideo}
            aria-label={callState.isVideoOff ? "Turn Video On" : "Turn Video Off"}
          >
            {callState.isVideoOff ? <MdVideocamOff className="h-5 w-5" /> : <MdVideocam className="h-5 w-5" />}
          </button>


          {
            callState.isIncomingCall ? 
            <button
            className="bg-yellow-500 text-white p-2 rounded-full hover:bg-green-600"
            onClick={()=>acceptVideoCall}
            disabled={callState.isCalling}
            aria-label="Start Call"
          >
            <MdCall className="h-5 w-5" />
          </button>:<button
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
            onClick={startVideoCall}
            disabled={callState.isCalling}
            aria-label="Start Call"
          >
            <MdCall className="h-5 w-5" />
          </button>
          }


        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
