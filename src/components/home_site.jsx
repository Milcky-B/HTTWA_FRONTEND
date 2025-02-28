import { useState, useEffect, useRef } from "react";

const MainPage = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcriptionResult, setTranscriptionResult] = useState("");
    const [translationResult, setTranslationResult] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [audioBlob, setAudioBlob] = useState(null);

    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const recognition = useRef(null);

    useEffect(() => {
        if (!isRecording) return;

        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder.current = new MediaRecorder(stream);

                mediaRecorder.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.current.push(event.data);
                    }
                };

                mediaRecorder.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
                    setAudioBlob(audioBlob);
                    audioChunks.current = [];
                };

                mediaRecorder.current.start();
            } catch (error) {
                console.error("Error accessing microphone:", error);
            }
        };

        const startTranscription = () => {
            if (!("webkitSpeechRecognition" in window)) {
                alert("Speech recognition is not supported in this browser.");
                return;
            }

            recognition.current = new window.webkitSpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = true;
            recognition.current.lang = "en-US";

            recognition.current.onresult = (event) => {
                let finalTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + " ";
                    }
                }
                setTranscriptionResult(finalTranscript);
            };

            recognition.current.start();
        };

        startRecording();
        startTranscription();

        return () => {
            if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
                mediaRecorder.current.stop();
            }
            if (recognition.current) {
                recognition.current.stop();
            }
        };
    }, [isRecording]);

    const handleStartRecording = () => {
        setIsRecording((prev) => !prev);
    };

    const handlePlayRecording = () => {
        if (audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    const handleTranslate = async () => {
        if (transcriptionResult && selectedLanguage) {
            try {
                const response = await fetch(`https://htwa-backend.vercel.app/translate/?text=${encodeURIComponent(transcriptionResult)}&lang=${selectedLanguage}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTranslationResult(data.translated_text);
            } catch (error) {
                console.error('Error translating text:', error);
                setTranslationResult("Error occurred during translation.");
                window.alert("An error occurred during translation. Please try again.");
            }
        }
    };

    const handleClear = () => {
        setTranscriptionResult("");
        setTranslationResult("");
        setAudioBlob(null);
        setSelectedLanguage("");
    };

    return (
        <div className="container-fluid px-4 py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <h1 className="text-center fw-bold mb-5">Healthcare Translation & Transcription Web App</h1>

                    <div className="d-grid gap-4">
                        <button
                            className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-3"
                            onClick={handleStartRecording}
                        >
                            <i className="bi bi-mic-fill"></i>
                            {isRecording ? "Stop Recording" : "Start Recording"}
                        </button>

                        <button
                            className="btn btn-info text-white d-flex align-items-center justify-content-center gap-2 py-3"
                            onClick={handlePlayRecording}
                            disabled={!audioBlob}
                        >
                            <i className="bi bi-play-fill"></i>
                            Play Recording
                        </button>

                        <div>
                            <label className="form-label fs-5 fw-medium mb-2">Result:</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                value={transcriptionResult}
                                placeholder="Transcription result will appear here..."
                                readOnly
                            ></textarea>
                        </div>

                        <div>
                            <select className="form-select py-3" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                                <option value="" disabled>Select language for translation</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="sw">Swahili</option>
                                <option value="cs">Czech</option>
                                <option value="ar">Arabic</option>

                            </select>
                        </div>

                        <button className="btn btn-success py-3" onClick={handleTranslate} disabled={!transcriptionResult || !selectedLanguage}>
                            Translate
                        </button>

                        <div>
                            <label className="form-label fs-5 fw-medium mb-2">Translation:</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                value={translationResult}
                                placeholder="Translation will appear here..."
                                readOnly
                            ></textarea>
                        </div>

                        <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-3" onClick={handleClear}>
                            <i className="bi bi-trash-fill"></i> Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
