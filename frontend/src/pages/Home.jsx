import React, { useState } from 'react';
import MicrophoneButton from '../components/MicrophoneButton';
import Timer from '../components/Timer';
import { useNavigate } from 'react-router-dom';
import UploadBirdSound from '../components/UploadBirdSound';

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const navigate = useNavigate();

  const handleMicClick = async () => {
    if (isRecording) {
      if (isPaused) {
        mediaRecorder.resume();
        setIsPaused(false);
      } else {
        mediaRecorder.pause();
        setIsPaused(true);
      }
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newMediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      newMediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      newMediaRecorder.onstart = () => {
        setIsRecording(true);
        setIsPaused(false);
        setShowUploadButton(false);
      };

      newMediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsPaused(false);
        setShowUploadButton(true);

        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        setIsAnalyzing(true);
        setIsLoading(true);

        try {
          const response = await fetch('https://bird-sound-classification-jpcc.onrender.com/upload-audio', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (response.ok) {
            const confidence = Math.round(result.confidence);
            const predictedClass = result.predicted_class;
            navigate('/result', { state: { confidence, predictedClass } });
          } else {
            console.error('Failed to send audio data');
          }
        } catch (error) {
          console.error('Error sending audio data:', error);
        } finally {
          setIsAnalyzing(false);
          setIsLoading(false);
        }
      };

      setMediaRecorder(newMediaRecorder);
      newMediaRecorder.start();
    }
  };

  const handleStopClick = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setResetTimer(true);
    setIsAnalyzing(true);
    setIsLoading(true);
  };

  return (
    <div className="h-screen w-full overflow-hidden relative flex flex-col items-center justify-center text-white bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 p-4">
      <div className="flex flex-col items-center w-full mt-[-100px]">
        {!isAnalyzing && (
          <>
            <Timer isRecording={isRecording && !isPaused} resetTimer={resetTimer} />
            <p className="mt-10 text-lg text-center">
              {isRecording ? (isPaused ? 'Recording Paused' : 'Recording in progress') : 'Start Recording'}
            </p>
          </>
        )}
        {isAnalyzing && isLoading && (
          <div className="text-white mt-20 text-lg text-center">
            Analyzing the sound
            <span className="inline-flex ml-1">
              <span className="animate-loading">.</span>
              <span className="animate-loading animation-delay-300">.</span>
              <span className="animate-loading animation-delay-600">.</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-8 w-full justify-center mt-16">
        {!isAnalyzing && (
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full -m-2"></div>
            <MicrophoneButton
              isRecording={isRecording}
              isPaused={isPaused}
              onClick={handleMicClick}
            />
          </div>
        )}

        {isRecording && !isAnalyzing && (
          <div
            className={`relative transition-opacity duration-1000 ${
              isRecording ? 'opacity-100 animate-fade-in-bounce' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-white/30 rounded-full -m-2"></div>
            <MicrophoneButton
              isRecording={true}
              onClick={handleStopClick}
              isStopButton
            />
          </div>
        )}
      </div>

      <div className='mt-16 w-full flex justify-center'>
        {!isAnalyzing && showUploadButton && (
          <UploadBirdSound setIsAnalyzing={setIsAnalyzing} />
        )}
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-[145px] transition-colors duration-500 ${
          isRecording && !isPaused ? 'bg-white' : 'bg-gradient-to-b from-blue-500 to-blue-600'
        } rounded-t-[100%] transform scale-x-[1.1] scale-y-[1.1]`}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-blue-600 to-blue-800 transform scale-x-[1.1] scale-y-[1.1] rounded-t-[100%]"
      />
    </div>
  );
};

export default Home;
