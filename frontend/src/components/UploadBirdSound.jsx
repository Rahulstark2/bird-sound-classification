import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadBirdSound = ({ setIsAnalyzing }) => {
  const inputRef = React.useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = event.target.files;
    const formData = new FormData();
    
    if (files.length > 0) {
        const file = files[0];
        const fileType = file.type;

        if (fileType === 'audio/mpeg' || fileType === 'audio/wav') {
            formData.append('audio', file); 
        } else {
            console.error("Invalid File Type. Please upload only mp3 and wav files.");
            return;
        }

        setIsAnalyzing(true); 

        fetch('http://127.0.0.1:8000/upload-audio', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            const confidence = Math.round(result.confidence); 
            const predictedClass = result.predicted_class;
            setTimeout(() => {
                setIsAnalyzing(false);
                navigate('/result', { state: { confidence, predictedClass } });
            }, 5000); 
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setIsAnalyzing(false);
        });
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      sx={{ width: '250px', height: '50px' }}
    >
      Upload Bird Sound
      <VisuallyHiddenInput
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        multiple
        accept=".mp3, .wav"
      />
    </Button>
  );
};

export default UploadBirdSound;
