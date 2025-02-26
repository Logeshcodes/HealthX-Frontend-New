import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URI } from "../utils/constants";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext).socket;

console.log("hi")

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URI, {
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to socket");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket");
      setSocket(null);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  console.log("SocketProvider rendering with socket:", socket);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
