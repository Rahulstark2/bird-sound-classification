import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useToast } from '@chakra-ui/react';
import { Tooltip } from '@radix-ui/themes'

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

const UploadDataset = () => {
  const inputRef = React.useRef(null);
  const toast = useToast();

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('webkitdirectory', '');
    }
  }, []);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    fetch('http://127.0.0.1:8000/upload-dataset', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      toast({
        title: "Upload Successful",
        description: "Your dataset has been uploaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your dataset.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
    });
  }

  return (
    <Tooltip content="Create a folder named as bird name and in that folder, bird sound recordings will be there.">
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ width: '200px', height: '50px' }}
      >
        Upload Dataset
        <VisuallyHiddenInput
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          multiple
        />
      </Button>
    </Tooltip>
  );
};

export default UploadDataset;
