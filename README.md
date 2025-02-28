Healthcare Translation & Transcription Web App


This is a web application designed to facilitate real-time transcription and translation of healthcare-related conversations. The app allows users to record audio, transcribe the spoken words, and translate the transcription into a selected language. It integrates with the MyMemory Translation API for translation services.

Features

Audio Recording: Record audio directly from the user's microphone.

Real-Time Transcription: Transcribe the recorded audio into text using the Web Speech API.

Language Translation: Translate the transcribed text into a selected language using the MyMemory Translation API.

Playback: Play back the recorded audio.

Clear Functionality: Clear the transcription, translation, and selected language with a single button.

Resources Used

Frontend:

React: A JavaScript library for building user interfaces.

Bootstrap: A CSS framework for responsive and modern UI design.

Web Speech API: For real-time speech recognition and transcription.

Backend:

FastAPI: A modern, fast (high-performance) web framework for building APIs with Python.

MyMemory Translation API: For translating text into various languages.

Other Tools:

Git: For version control.

GitHub: For hosting the repository.

Vercel: For deployment


Usage

Start Recording: Click the "Start Recording" button to begin recording audio. The button will change to "Stop Recording" while recording is in progress.

Transcription: The transcribed text will appear in the "Result" textarea in real-time.

Select Language: Choose a target language from the dropdown menu.

Translate: Click the "Translate" button to translate the transcribed text into the selected language. The translated text will appear in the "Translation" textarea.

Play Recording: Click the "Play Recording" button to play back the recorded audio.

Clear: Click the "Clear" button to reset the transcription, translation, and selected language.
