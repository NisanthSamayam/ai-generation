import React, { useState, useEffect, useRef } from 'react';

// Extend the Window interface to include Web Speech API properties for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type ToolMode = 'tts' | 'stt';

const AudioTools: React.FC = () => {
    const [mode, setMode] = useState<ToolMode>('tts');
    const [textToSpeak, setTextToSpeak] = useState<string>('');
    const [transcript, setTranscript] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);
    
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                 setTranscript(prev => prev + finalTranscript + interimTranscript);
            };
            
            recognition.onend = () => {
                if(isListening) {
                    recognition.start();
                }
            }

            recognitionRef.current = recognition;
        } else {
            console.warn("Speech Recognition not supported in this browser.");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isListening]);

    const handleSpeak = () => {
        if (!textToSpeak.trim() || !('speechSynthesis' in window)) return;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Audio Tools</h2>
                <p className="mt-2 text-lg text-gray-400">Convert text to speech or transcribe your voice into text in real-time.</p>
            </header>

            <div className="flex border-b border-gray-700">
                <button onClick={() => setMode('tts')} className={`px-4 py-2 text-sm font-medium ${mode === 'tts' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Text to Speech</button>
                <button onClick={() => setMode('stt')} className={`px-4 py-2 text-sm font-medium ${mode === 'stt' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Speech to Text</button>
            </div>
            
            {mode === 'tts' && (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg p-6 space-y-4">
                    <label htmlFor="tts-input" className="block text-sm font-medium text-gray-300">
                        Text to Convert
                    </label>
                    <textarea
                        id="tts-input"
                        value={textToSpeak}
                        onChange={(e) => setTextToSpeak(e.target.value)}
                        placeholder="Enter text here and click 'Speak' to hear it."
                        className="w-full h-40 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button
                        onClick={handleSpeak}
                        disabled={!textToSpeak.trim()}
                        className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        Speak
                    </button>
                </div>
            )}
            
            {mode === 'stt' && (
                 <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg p-6 space-y-4">
                    <button
                        onClick={toggleListening}
                        className={`w-full flex justify-center items-center gap-3 px-6 py-3 text-white font-semibold rounded-md transition-all duration-200 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                         {isListening && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span></span>}
                        {isListening ? 'Stop Listening' : 'Start Listening'}
                    </button>
                     <div className="w-full h-40 p-3 bg-gray-900 border border-gray-600 rounded-md">
                         <p className="text-gray-300">{transcript || 'Your transcribed text will appear here...'}</p>
                     </div>
                     {!recognitionRef.current && <p className="text-yellow-400 text-sm mt-2">Speech recognition is not supported by your browser. Try Chrome or Edge.</p>}
                </div>
            )}
        </div>
    );
};

export default AudioTools;