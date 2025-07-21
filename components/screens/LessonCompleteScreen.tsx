import React from 'react';
import Button from '../ui/Button';

interface LessonCompleteScreenProps {
  score: number;
  totalQuestions: number;
  onContinue: () => void;
}

const CheckmarkIcon = () => (
    <svg className="w-24 h-24 text-brand-green" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 27L22 35L38 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


const LessonCompleteScreen: React.FC<LessonCompleteScreenProps> = ({ score, totalQuestions, onContinue }) => {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    let message = "Good effort!";
    if (percentage > 90) {
        message = "Amazing work!";
    } else if (percentage > 70) {
        message = "Great job!";
    }

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto text-center p-4">
            <header className="py-4">
                 {/* You can add a close button here if needed */}
            </header>
            <main className="flex-grow flex flex-col items-center justify-center gap-6">
                <div className="transform transition-transform duration-500 ease-out animate-crown-pop">
                    <CheckmarkIcon />
                </div>
                <h1 className="text-4xl font-black text-brand-gray-900">Lesson Complete!</h1>
                <p className="text-xl text-brand-gray-800">{message}</p>

                <div className="w-full max-w-xs space-y-4">
                     <div className="flex justify-between font-bold text-lg">
                        <span className="text-brand-gray-800">Score</span>
                        <span className="text-brand-green">{score} / {totalQuestions}</span>
                    </div>
                     <div className="flex justify-between font-bold text-lg">
                        <span className="text-brand-gray-800">Accuracy</span>
                        <span className="text-brand-green">{percentage}%</span>
                    </div>
                </div>
            </main>
            <footer className="p-4">
                 <div className="max-w-2xl mx-auto">
                    <Button onClick={onContinue} variant="success">
                        Continue
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default LessonCompleteScreen;