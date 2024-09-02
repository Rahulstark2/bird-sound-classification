# Bird Sound Classification Project

Welcome to the Bird Sound Classification project! This web application is designed to classify bird sounds using deep learning models. The project is built with FastAPI for the backend and ReactJS for the frontend.

## Project Overview

### Home Page
- **Record and Upload Audio**: On the Home page, you can record audio or upload a bird sound file (like `.wav` or `.mp3`).

### Result Page
- **View Classification Results**: Here, you’ll see the predicted bird species and the confidence score based on the audio file you provided.

### Submit Feedback
- **Feedback Form**: After getting your results, you can submit feedback using our form. Your input will help us improve the application!

### Upload Dataset
- **Dataset Upload**: If you have a dataset of bird sounds, you can upload it here. The dataset will be processed by our backend.

## Tech Stack

- **Frontend**: ReactJS with Tailwind CSS
- **Backend**: FastAPI
- **Deployment**: 
  - Frontend is deployed on Vercel
  - Backend is deployed on Render

## API Interaction

In this project, we use the `fetch` API to communicate between the frontend and backend. Audio files, feedback, and datasets are all sent to various API endpoints, where they are processed and used to generate results or store data.

## Known Issues

- **Safari Browser**: There are some challenges with recording or uploading media on Safari. Everything works fine on Chrome and other browsers, so I recommend using one of those for the best experience.


## Contributing

Feel free to fork this repository and make your own contributions. Any feedback or suggestions are welcome!

## Contact

If you have any questions or issues, don't hesitate to reach out.
