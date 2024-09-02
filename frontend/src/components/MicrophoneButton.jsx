import React from 'react';
import micImage from '../assets/mic.png';
import pauseImage from '../assets/pause.png';
import stopImage from '../assets/stop.png';

const MicrophoneButton = ({ isRecording, onClick, isStopButton, isPaused }) => {
  return (
    <button
      className={`relative p-6 rounded-full transition-colors duration-300 bg-[#a5b9dc] overflow-hidden`}
      onClick={onClick}
    >
      <div className="relative w-12 h-12">
        {!isStopButton && (
          <>
            
            <img
              src={micImage}
              alt="Microphone"
              className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                isRecording && !isPaused
                  ? 'opacity-0 rotate-180 scale-50'
                  : 'opacity-100 rotate-0 scale-100'
              }`}
            />
            
            
            <img
              src={pauseImage}
              alt="Pause"
              className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                isRecording && !isPaused
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 -rotate-180 scale-50'
              }`}
            />
          </>
        )}
        {isStopButton && (
          <img
            src={stopImage}
            alt="Stop"
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
    </button>
  );
};

export default MicrophoneButton;