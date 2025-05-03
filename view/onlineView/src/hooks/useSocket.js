import { useEffect } from 'react';
import { io } from 'socket.io-client';

const useSocket = (onProgress) => {
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('progress', (data) => {
      onProgress(data);
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [onProgress]);
};

export default useSocket;
