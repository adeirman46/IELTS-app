
import React, { useState } from 'react';
import { SpeakingTaskQuestion as Question } from '../../types';
import { generateSampleAnswer } from '../../services/geminiService';
import Button from '../ui/Button';

const MicrophoneIcon = ({ isRecording }: { isRecording: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 text-white transition-colors ${isRecording ? 'text-brand-red' : 'text-white'}`} fill="currentColor" viewBox="0 0 16 16">
      <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
      <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
    </svg>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gray-700"></div>
  </div>
);

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};


const SpeakingTask: React.FC<{ question: Question; onComplete: () => void }> = ({ question, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [sampleAnswer, setSampleAnswer] = useState<string | null>(null);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const [mainQuestion, ...cuePointsArray] = question.question.split('\n');
  const cueText = cuePointsArray.join('\n').trim();

  const toggleRecording = () => {
    if (!isRecording) {
      // In a real app, you would start microphone recording here.
      // navigator.mediaDevices.getUserMedia({ audio: true }) ...
      console.log('Starting recording (simulated)...');
    } else {
      // Stop recording and process audio.
      console.log('Stopping recording (simulated)...');
      setHasFinished(true);
    }
    setIsRecording(!isRecording);
  };
  
  const handleShowSampleAnswer = async () => {
    if (question.sampleAnswer) {
      setSampleAnswer(question.sampleAnswer);
      return;
    }
    setIsLoadingAnswer(true);
    const answer = await generateSampleAnswer(question.prompt, question.question);
    setSampleAnswer(answer);
    setIsLoadingAnswer(false);
  };

  return (
    <div className="flex flex-col h-full text-center">
      <div className="flex-grow flex flex-col items-center justify-center">
        <p className="text-lg text-brand-gray-800 mb-2">{question.prompt}</p>
        <h2 className="text-3xl font-bold text-brand-gray-900 mb-4 text-center">{mainQuestion}</h2>
        {cueText && (
          <div className="bg-brand-gray-100 p-4 rounded-lg border border-brand-gray-200 text-left w-full max-w-md mb-8">
            <p className="text-brand-gray-800 whitespace-pre-line font-medium">{cueText}</p>
          </div>
        )}


        <button
            onClick={toggleRecording}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-all transform duration-200 ${isRecording ? 'bg-red-200 animate-pulse' : 'bg-brand-blue hover:scale-105'}`}
            disabled={hasFinished}
        >
          <MicrophoneIcon isRecording={isRecording} />
        </button>
        <p className="mt-4 text-brand-gray-800 font-semibold">{isRecording ? 'Recording...' : hasFinished ? 'Finished' : 'Tap to start recording'}</p>
        <p className="text-sm text-brand-gray-700">(Microphone functionality is simulated)</p>
        
        {hasFinished && !sampleAnswer && (
             <div className="mt-8">
                {isLoadingAnswer ? (
                    <LoadingSpinner />
                ) : (
                    <Button onClick={handleShowSampleAnswer} variant="secondary">
                        Show Sample Answer
                    </Button>
                )}
             </div>
        )}

        {sampleAnswer && (
            <div className="w-full mt-6 p-4 bg-yellow-50 border border-brand-yellow rounded-lg text-left animate-fade-in">
                <h3 className="font-bold text-yellow-800 mb-2">Sample Answer</h3>
                <p className="text-yellow-900 whitespace-pre-wrap">
                    <FormattedText text={sampleAnswer} />
                </p>
            </div>
        )}

      </div>
       <div className="pt-4">
        <Button onClick={onComplete} disabled={!hasFinished}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SpeakingTask;