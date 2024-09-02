import os
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi import File, UploadFile, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment
from io import BytesIO
import librosa
import numpy as np
import tensorflow as tf
import json
from pydantic import BaseModel
from gridfs import GridFS
from fastapi.responses import JSONResponse
from typing import List




app = FastAPI()

origins = [
    "http://localhost:5174",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Feedback(BaseModel):
    confidence: int
    realName: str
    feedback: str
load_dotenv()
mongodb_uri = os.getenv("MONGODB_URI")

client = MongoClient(mongodb_uri)
db = client.bird_sound_classification
collection = db.feedback
fs=GridFS(db)

@app.post("/upload-audio")
async def upload_audio(audio: UploadFile = File(...)):
    try:
        if not (audio.filename.endswith('.wav') or audio.filename.endswith('.mp3')):
            return {"message": "Invalid file format. Only .wav and .mp3 files are allowed."}


        audio_data = await audio.read()
        audio_stream = BytesIO(audio_data)


        if(audio.filename.endswith('.wav')):
            sound = AudioSegment.from_file(audio_stream, format="webm")
        else:
            sound = AudioSegment.from_file(audio_stream, format=audio.filename.split('.')[-1])
        mp3_file_path = "recording.mp3"
        sound.export(mp3_file_path, format="mp3")
        print(f"MP3 audio saved to {mp3_file_path}")

        with open('prediction.json', mode='r') as f:
            prediction_dict = json.load(f)

        audio_file = os.path.join(os.getcwd(), 'recording.mp3')
        audio, sample_rate = librosa.load(audio_file)


        mfccs_features = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
        mfccs_features = np.mean(mfccs_features, axis=1)


        mfccs_features = np.expand_dims(mfccs_features, axis=0)
        mfccs_features = np.expand_dims(mfccs_features, axis=2)


        mfccs_tensors = tf.convert_to_tensor(mfccs_features, dtype=tf.float32)


        model = tf.keras.models.load_model('model.h5')
        prediction = model.predict(mfccs_tensors)


        target_label = np.argmax(prediction)


        predicted_class = prediction_dict[str(target_label)]
        confidence = round(np.max(prediction) * 100, 2)
        return {"predicted_class": predicted_class, "confidence": confidence}

    except Exception as e:
        print(f"Error processing audio file: {e}")
        return {"message": "Failed to process audio data"}

@app.post("/submit-feedback")
async def submit_feedback(feedback: Feedback):

    feedback_data = {
        "realName": feedback.realName,
        "confidence": feedback.confidence,
        "feedback": feedback.feedback
    }


    with open('recording.mp3', 'rb') as audio_file:
        audio_id = fs.put(audio_file, filename='recording.mp3')


    feedback_data['audio_id'] = str(audio_id)


    collection.insert_one(feedback_data)

    return {"message": "Feedback received and stored in MongoDB Atlas"}

@app.post("/upload-dataset")
async def upload_dataset(files: List[UploadFile] = File(...)):
    try:
        file_ids = []
        for file in files:
            file_id = fs.put(file.file, filename=file.filename)
            file_ids.append(str(file_id))
        return JSONResponse(status_code=200, content={"message": "Files uploaded successfully", "file_ids": file_ids})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})


