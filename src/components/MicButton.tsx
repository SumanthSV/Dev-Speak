import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface MicButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({ 
  isRecording, 
  isProcessing, 
  onStart, 
  onStop 
}) => {
  const handleClick = () => {
    if (isProcessing) return;
    
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={`
        relative p-6 rounded-full transition-all duration-300 shadow-2xl
        ${isRecording 
          ? 'bg-red-500 hover:bg-red-600 scale-110' 
          : 'bg-purple-500 hover:bg-purple-600 hover:scale-105 active:scale-95'
        }
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        text-white transform
      `}
      title={
        isProcessing 
          ? 'Processing...' 
          : isRecording 
            ? 'Click to stop recording' 
            : 'Click to start recording'
      }
    >
      {/* Pulse Animation Ring */}
      {isRecording && (
        <>
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30"></div>
          <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse opacity-20"></div>
        </>
      )}
      
      {/* Icon */}
      <div className="relative z-10">
        {isRecording ? (
          <MicOff className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </div>
      
      {/* Processing Spinner */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white opacity-50"></div>
        </div>
      )}
    </button>
  );
};

export default MicButton;