import React, { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import { useToast, ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";

const muiTheme = createTheme(); 

const SubmitButton = ({ confidence, realName, feedback }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast(); 

  const handleClick = async () => {
    if (!feedback.trim()) {
      toast({
        title: 'Feedback is empty',
        description: 'Please enter your feedback before submitting.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  
    setLoading(true);
  
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    try {
      const response = await fetch('http://127.0.0.1:8000/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confidence,
          realName,
          feedback,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
  
      
      toast({
        title: 'Feedback submitted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "top",
      });
  
      
    } catch (error) {
      console.error(error);
  
     
      toast({
        title: 'Error submitting feedback',
        description: 'An error occurred while submitting your feedback. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top",
      });
  
      
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ChakraProvider>
      <MUIThemeProvider theme={muiTheme}>
        <Box sx={{ '& > button': { m: 1 } }}>
          <LoadingButton
            onClick={handleClick}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            sx={{ width: '200px', height: '50px' }}
          >
            Submit Feedback
          </LoadingButton>
        </Box>
      </MUIThemeProvider>
    </ChakraProvider>
  );
};

export default SubmitButton;
