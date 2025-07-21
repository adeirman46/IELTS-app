import React, { useRef } from 'react';
import type { ShortAnswerQuestion as Question } from '../../types';

interface ShortAnswerProps {
  question: Question;
  isAnswered: boolean;
  userAnswer: string;
  onTextChange: (text: string) => void;
  passageHtml?: string;
  onPassageUpdate: (newHtml: string) => void;
}

const ShortAnswer: React.FC<ShortAnswerProps> = ({ question, isAnswered, userAnswer, onTextChange, passageHtml, onPassageUpdate }) => {
  const passageRef = useRef<HTMLDivElement>(null);
  const isCorrect = question.correctAnswers.some(ans => ans.toLowerCase() === userAnswer.trim().toLowerCase());

  const getInputClass = () => {
    const baseClass = "w-48 text-center p-2 border-2 rounded-xl text-lg transition-all duration-200 focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-gray-900";
    if (isAnswered) {
      return isCorrect 
        ? `${baseClass} bg-green-100 border-brand-green font-bold`
        : `${baseClass} bg-red-100 border-brand-red`;
    }
    return `${baseClass} bg-white border-brand-gray-300`;
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    
    if (passageRef.current && passageRef.current.contains(range.commonAncestorContainer)) {
        const mark = document.createElement('mark');
        mark.className = 'bg-brand-yellow/50';
        try {
            range.surroundContents(mark);
            selection.removeAllRanges(); 
            
            if (passageRef.current) {
              onPassageUpdate(passageRef.current.innerHTML);
            }
        } catch(e) {
            console.error("Highlighting failed:", e);
        }
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Image\\nNot+Found";
    e.currentTarget.alt = "Image placeholder"
  }

  const [beforeText, afterText] = question.questionText.split('___');

  return (
    <div className="flex flex-col h-full text-center">
      <div className="flex-grow">
         {question.audioUrl && (
          <div className="mb-4 bg-brand-gray-100 p-4 rounded-2xl">
            <p className="font-bold mb-2 text-brand-gray-800">Audio Control</p>
            <audio controls className="w-full" key={question.audioUrl}>
              <source src={question.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        {question.passage && passageHtml && (
            <div className="mb-4 bg-brand-gray-100 p-4 rounded-2xl max-h-72 overflow-y-auto text-left" onMouseUp={handleHighlight}>
              <h3 className="font-bold text-lg mb-2 text-brand-gray-900">Reading Passage</h3>
              <div ref={passageRef} className="text-lg text-brand-gray-900 whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: passageHtml }} />
            </div>
        )}
        {question.imageUrl && (
            <div className="mb-4 p-2 bg-brand-gray-100 rounded-2xl">
                <img src={question.imageUrl} alt="Question context" className="max-w-full mx-auto rounded-md" onError={handleImageError}/>
            </div>
        )}

        <p className="text-xl font-semibold text-brand-gray-900 mb-6">{question.prompt}</p>

        <div className="my-4 flex items-center justify-center gap-2 flex-wrap">
            {beforeText && <span className="text-lg text-brand-gray-900 font-medium">{beforeText}</span>}
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => onTextChange(e.target.value)}
                readOnly={isAnswered}
                className={getInputClass()}
                placeholder="Your answer"
                aria-label="Your answer"
            />
            {afterText && <span className="text-lg text-brand-gray-900 font-medium">{afterText}</span>}
        </div>
      </div>
    </div>
  );
};

export default ShortAnswer;