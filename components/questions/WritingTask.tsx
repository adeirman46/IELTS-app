import React, { useState } from 'react';
import { WritingTaskQuestion as Question } from '../../types';
import Button from '../ui/Button';

interface WritingTaskProps {
  question: Question;
  onComplete: () => void;
}

const WritingTask: React.FC<WritingTaskProps> = ({ question, onComplete }) => {
  const [essay, setEssay] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (essay.trim().split(' ').length < 20) {
        setError('Please write at least 20 words before submitting.');
        return;
    }
    setError(null);
    setSubmitted(true);
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Image\\nNot+Found";
    e.currentTarget.alt = "Image placeholder"
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <div className="bg-brand-gray-100 p-4 rounded-2xl mb-4">
            <h3 className="font-bold text-lg mb-2 text-brand-gray-900">{question.prompt}</h3>
            {question.imageUrl && (
              <div className="my-4 p-2 bg-white rounded-xl">
                  <img src={question.imageUrl} alt="Writing task context" className="max-w-full mx-auto rounded-md" onError={handleImageError}/>
              </div>
            )}
            <p className="text-brand-gray-900 whitespace-pre-line">{question.task}</p>
        </div>

        {!submitted && (
            <>
                <textarea
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    className="w-full h-64 p-3 border-2 bg-white border-brand-gray-300 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent transition text-brand-gray-900"
                    placeholder="Start writing your essay here..."
                />
                {error && <p className="text-brand-red text-sm mt-2">{error}</p>}
            </>
        )}
        
        {submitted && (
           <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mt-4 animate-fade-in">
              <div>
                  <h3 className="text-lg font-bold text-brand-gray-800 mb-2">Your Answer</h3>
                  <div className="p-4 bg-brand-gray-100 rounded-lg text-brand-gray-900 whitespace-pre-wrap text-sm h-72 overflow-y-auto">{essay}</div>
              </div>
              <div>
                  <h3 className="text-lg font-bold text-brand-gray-800 mb-2">
                      Sample Answer 
                      {question.sampleAnswerBand && <span className="text-brand-blue font-black"> (Band {question.sampleAnswerBand.toFixed(1)})</span>}
                  </h3>
                  <div className="p-4 bg-yellow-50 border border-brand-yellow rounded-lg text-yellow-900 text-sm h-72 overflow-y-auto">
                      {question.sampleAnswer && question.sampleAnswer.split('\n\n').map((para, index) => (
                          <p key={index} className="mb-4 last:mb-0">{para}</p>
                      ))}
                      {question.examinerComment && (
                          <>
                              <h4 className="font-bold mt-4 pt-2 border-t border-yellow-200/50 text-yellow-800">Examiner's Comment:</h4>
                              <p className="italic">{question.examinerComment}</p>
                          </>
                      )}
                  </div>
              </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        {submitted ? (
            <Button onClick={onComplete} variant="success">Continue</Button>
        ) : (
            <Button onClick={handleSubmit} disabled={essay.length === 0}>
                Submit
            </Button>
        )}
      </div>
    </div>
  );
};

export default WritingTask;