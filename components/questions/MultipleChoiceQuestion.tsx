import React, { useRef } from 'react';
import type { MultipleChoiceQuestion as Question } from '../../types';

interface MultipleChoiceQuestionProps {
  question: Question;
  isAnswered: boolean;
  selectedOptions: string[];
  onOptionSelect: (options: string[]) => void;
  passageHtml?: string;
  onPassageUpdate: (newHtml: string) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, isAnswered, selectedOptions, onOptionSelect, passageHtml, onPassageUpdate }) => {
  const passageRef = useRef<HTMLDivElement>(null);
  const maxSelections = question.maxSelections || 1;

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;

    const newSelected = [...selectedOptions];
    const isSelected = newSelected.includes(option);

    if (maxSelections === 1) {
      onOptionSelect([option]);
      return;
    }

    if (isSelected) {
      onOptionSelect(newSelected.filter(item => item !== option));
    } else {
      if (newSelected.length < maxSelections) {
        onOptionSelect([...newSelected, option]);
      }
    }
  };
  
  const getButtonClass = (option: string) => {
    const baseClass = "w-full text-left p-4 my-2 border-2 rounded-2xl text-lg transition-all duration-200 font-semibold";
    if (isAnswered) {
        if (question.correctAnswers.includes(option)) {
            return `${baseClass} bg-green-100 border-brand-green text-green-900`;
        }
        if (selectedOptions.includes(option) && !question.correctAnswers.includes(option)) {
            return `${baseClass} bg-red-100 border-brand-red text-red-900`;
        }
        return `${baseClass} border-brand-gray-300 text-brand-gray-700`;
    }
    
    if (selectedOptions.includes(option)) {
        return `${baseClass} bg-blue-100 border-brand-blue text-brand-gray-900`;
    }

    return `${baseClass} bg-white border-brand-gray-300 text-brand-gray-900 hover:bg-brand-gray-100 hover:border-brand-blue`;
  }

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


  return (
    <div className="flex flex-col h-full">
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
            <div className="mb-4 bg-brand-gray-100 p-4 rounded-2xl max-h-72 overflow-y-auto" onMouseUp={handleHighlight}>
              <h3 className="font-bold text-lg mb-2 text-brand-gray-900">Reading Passage</h3>
              <div ref={passageRef} className="text-lg text-brand-gray-900 whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: passageHtml }} />
            </div>
        )}
        {question.imageUrl && (
            <div className="mb-4 p-2 bg-brand-gray-100 rounded-2xl">
                <img src={question.imageUrl} alt="Question context" className="max-w-full mx-auto rounded-md" onError={handleImageError}/>
            </div>
        )}
        <p className="text-lg font-semibold text-brand-gray-700 mb-2 whitespace-pre-line">{question.prompt}</p>
        {question.questionText && <p className="text-xl font-semibold text-brand-gray-900 mb-4">{question.questionText}</p>}
        <div>
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={getButtonClass(option)}
              disabled={isAnswered}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;