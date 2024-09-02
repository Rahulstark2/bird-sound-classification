import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SubmitButton from '../components/SubmitButton';
import UploadDataset from '../components/UploadDataset';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { confidence, predictedClass } = location.state || {};

  useEffect(() => {
    if (!confidence || !predictedClass) {
      navigate('/');
    }
  }, [confidence, predictedClass, navigate]);


  
  const birdMapping = {
    'aldfly': 'Alder Flycatcher ',
    'ameavo': 'American Avocet ',
    'amebit': 'American Bittern',
    'amecro': 'American Crow ',
    'amegfi': 'American Goldfinch',
    'amekes': 'American Kestrel',
    'amepip': 'Buff-bellied Pipit ',
    'amered': 'American Redstart ',
    'amerob': 'American Robin',
    'amewig': 'American Wigeon ',
    'amewoo': 'American Woodcock ',
    'amtspa': 'American Tree Sparrow ',
    'annhum': 'Anna\'s Hummingbird',
    'astfly': 'Ash-throated Flycatcher ',
    'baisan': 'Baird\'s Sandpiper',
    'baleag': 'Bald Eagle ',
    'balori': 'Baltimore Oriole ',
    'banswa': 'Sand Martin',
    'barswa': 'Barn Swallow',
    'bawwar': 'Black-and-white Warbler ',
  };

  
  const realName = birdMapping[predictedClass] || 'Unknown Bird';


  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const imageElement = document.getElementById('birdImage');
    const imageFormats = ['jpg', 'jpeg', 'webp', 'avif'];
    let imageLoaded = false;
    for (let format of imageFormats) {
      const imageUrl = `/assets/birds/${predictedClass}.${format}`; // Adjusted path
      const image = new Image();
      image.src = imageUrl;
  
      image.onload = () => {
        imageElement.src = imageUrl;
        imageElement.alt = predictedClass;
        imageLoaded = true;
      };
  
      if (imageLoaded) {
        break;
      }
    }
  }, [predictedClass]);
  

  return (
    <div className="flex flex-col h-screen bg-gray p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-blue-500 text-2xl font-bold text-center mt-16">{confidence}% Match Found</h1>

        <div className="flex justify-center items-center mt-10">
          <img
            id="birdImage"
            alt="Placeholder"
            className="object-cover rounded-lg w-full max-w-[1000px]"
            style={{ height: '400px' }}
          />
        </div>

        <div className="bg-[#f0f0f0] rounded-lg p-4 mb-4 mt-10 w-full max-w-[500px] border border-gray-300">
          <p className="text-center text-gray-800 font-semibold">{realName}</p>
        </div>

        <div className="mb-4 w-full max-w-[500px]">
          <textarea
            className="bg-[#f0f0f0] rounded-lg p-4 w-full h-52 border border-gray-300 resize-none"
            placeholder="User Feedback:"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>

        <div className="mt-1">
          <SubmitButton confidence={confidence} realName={realName} feedback={feedback} />
        </div>

        <div className='mt-5 mb-5'>
          <UploadDataset/>
        </div>
      </div>
    </div>
  );
};

export default Result;
