import React, { useState, useEffect } from 'react';

const Timer = ({ isRecording, resetTimer }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;

    if (resetTimer) {
      setSeconds(0); 
    }

    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isRecording && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRecording, resetTimer]);

  return (
    <div className="bg-white bg-opacity-20 px-4 py-1 rounded-md w-[80px] flex justify-center">
      <span className="text-lg font-semibold text-black">
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
