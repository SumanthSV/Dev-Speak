import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Trash2, Volume2, User, Bot } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import { sendToOpenAI } from './utils/openai';
import { speakText } from './utils/speech';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      // console.log('Speech recognition started');
      setIsRecording(true);
      setError('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        handleSendMessage(finalTranscript);
      } else {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Speech recognition error occurred.';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone connection.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your internet connection.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      setError(errorMessage);
      setIsRecording(false);
      setTranscript('');
    };

    recognition.onend = () => {
      // console.log('Speech recognition ended');
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startRecording = () => {
    if (recognitionRef.current && !isRecording && !isProcessing) {
      setTranscript('');
      setError('');
      
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setError('Failed to start voice recognition. Please try again.');
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setTranscript('');

    try {
      const response = await sendToOpenAI(message.trim(), messages);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
        isTyping: true
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Wait for typewriter to finish, then speak
      // setTimeout(async () => {
      //   setIsSpeaking(true);
      //   await speakText(response);
      //   setIsSpeaking(false);
      // }, response.length * 50); // Approximate typewriter duration

      // ✅ Start speaking immediately with typewriter
      setTimeout(() => {
        setIsSpeaking(true);
        speakText(response).finally(() => setIsSpeaking(false));
      }, 50);
      
    } catch (error) {
      console.error('Error getting response:', error);
      setError('Failed to get response. Please check your OpenAI API key and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setTranscript('');
    setError('');
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleMicClick = () => {
    if (isProcessing) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-800 flex items-center justify-center p-4">
      {/* Main Chat Container */}
      <div className="w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
            DevSpeak
          </h1>
          {/* <p className="text-lg text-purple-200 mb-4 max-w-2xl mx-auto leading-relaxed">
            Ask me questions using your voice and get answers as if you're talking directly to Sumanth SV, 
            AI Engineer & Full-Stack Developer.
          </p> */}
          
          {/* Tip Box */}
          <div className="w-full flex justify-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-200 text-sm backdrop-blur-sm text-center">
              <span className="mr-2">🧑‍💻</span>
              <span className="flex flex-wrap justify-center">
                Ask questions by voice and get answers from{" "}
                <span className="text-yellow-300 font-semibold  ml-1 tracking-wide whitespace-nowrap">
                  Sumanth SV 
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            {messages.length === 0 ? (
              <div className="text-center text-gray-300 py-12">
                <Bot className="mx-auto mb-4 h-16 w-16 text-purple-400" />
                <p className="text-xl mb-2">Ready to chat!</p>
                <p className="text-sm opacity-75 mb-6">Click the microphone and start asking questions</p>
                <div className="text-xs text-gray-400 space-y-2 max-w-md mx-auto">
                  <p>Try asking: "What's your story?" or "What's your superpower?"</p>
                  {/* <div className="flex flex-col space-y-1 mt-4">
                    <p>• Make sure microphone permissions are enabled</p>
                    <p>• Speak clearly and wait for transcription</p>
                    <p>• Works best in Chrome, Safari, or Edge</p>
                  </div> */}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                    <div className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md' 
                          : 'bg-white/90 text-gray-800 rounded-bl-md border border-gray-200/50'
                      }`}>
                        <div className="text-sm leading-relaxed">
                          {message.type === 'bot' && message.isTyping ? (
                            <Typewriter
                              words={[message.content]}
                              loop={1}
                              cursor={false}
                              typeSpeed={30}
                              deleteSpeed={0}
                            />
                          ) : (
                            <span className="whitespace-pre-wrap">{message.content}</span>
                          )}
                        </div>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm text-gray-800 p-4 rounded-2xl rounded-bl-md max-w-xs border border-gray-200/50 shadow-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                          <span className="text-sm">Sumanth is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Current Transcript */}
          {(transcript || isRecording) && (
            <div className="px-6 pb-4">
              <div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg backdrop-blur-sm">
                <p className="text-blue-200 text-sm mb-1">
                  {isRecording ? '🎤 Listening...' : 'Transcript:'}
                </p>
                <p className="text-white">{transcript || 'Speak now...'}</p>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-4">
              {/* Microphone Button */}
              <button
                onClick={handleMicClick}
                disabled={isProcessing}
                className={`
                  relative p-4 rounded-full transition-all duration-300 shadow-2xl transform
                  ${isRecording 
                    ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse' 
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:scale-105 active:scale-95'
                  }
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  text-white
                `}
                title={
                  isProcessing 
                    ? 'Processing...' 
                    : isRecording 
                      ? 'Click to stop recording' 
                      : 'Click to start recording'
                }
              >
                {/* Glow Effect */}
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30"></div>
                    <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse opacity-20"></div>
                  </>
                )}
                
                {/* Icon */}
                <div className="relative z-10">
                  {isRecording ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </div>
                
                {/* Processing Spinner */}
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white opacity-50"></div>
                  </div>
                )}
              </button>
              
              {/* Stop Speaking Button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  title="Stop Speaking"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              )}
              
              {/* Clear Conversation Button */}
              {messages.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  title="Clear Conversation"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm mt-2 mb-[1px]">
          <p>Built with React, OpenAI GPT-4, and Web Speech APIs</p>
        </div>
      </div>
    </div>
  );
}

export default App;