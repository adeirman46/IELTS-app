import React, { useState, useEffect } from 'react';
import { Lesson, Question, QuestionType } from '../../types';
import ProgressBar from '../ui/ProgressBar';
import MultipleChoiceQuestion from '../questions/MultipleChoiceQuestion';
import WritingTask from '../questions/WritingTask';
import SpeakingTask from '../questions/SpeakingTask';
import ShortAnswer from '../questions/ShortAnswerQuestion';
import Button from '../ui/Button';

interface LessonScreenProps {
  lesson: Lesson;
  partIndex: number;
  onComplete: (score: number, total: number) => void;
  onExit: () => void;
}

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, partIndex, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const [selectedMcqOptions, setSelectedMcqOptions] = useState<string[]>([]);
  const [shortAnswerText, setShortAnswerText] = useState('');
  const [passageHtml, setPassageHtml] = useState<string | undefined>(undefined);
  const [score, setScore] = useState(0);
  
  const currentPart = lesson.parts[partIndex];
  const questionsInPart = currentPart.questions;
  const currentQuestion = questionsInPart[currentQuestionIndex];

  useEffect(() => {
    const lessonPassage = questionsInPart.find(q => q.passage)?.passage;
    setPassageHtml(lessonPassage);
  }, [questionsInPart]);


  useEffect(() => {
    setAnswerStatus('unanswered');
    setSelectedMcqOptions([]);
    setShortAnswerText('');
  }, [currentQuestionIndex, partIndex]);

  const handleCheckAnswer = () => {
    let isCorrect = false;
    if (currentQuestion.type === QuestionType.MULTIPLE_CHOICE) {
       const correctAnswers = currentQuestion.correctAnswers;
       isCorrect = selectedMcqOptions.length === correctAnswers.length &&
                   selectedMcqOptions.every(option => correctAnswers.includes(option));

    } else if (currentQuestion.type === QuestionType.SHORT_ANSWER) {
      isCorrect = currentQuestion.correctAnswers.some(
        (ans) => ans.toLowerCase() === shortAnswerText.trim().toLowerCase()
      );
    }

    if (isCorrect) {
        setScore(prev => prev + 1);
    }
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
  };

  const handleCompleteTask = () => {
    setScore(prev => prev + 1);
    setAnswerStatus('correct');
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsInPart.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(score, questionsInPart.length);
    }
  };

  const handlePassageUpdate = (newHtml: string) => {
    setPassageHtml(newHtml);
  }

  const renderQuestion = (question: Question) => {
    const passageProps = { passageHtml, onPassageUpdate: handlePassageUpdate };
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        return <MultipleChoiceQuestion 
                  question={question} 
                  onOptionSelect={setSelectedMcqOptions}
                  isAnswered={answerStatus !== 'unanswered'}
                  selectedOptions={selectedMcqOptions}
                  {...passageProps}
               />;
      case QuestionType.SHORT_ANSWER:
        return <ShortAnswer 
                  question={question}
                  onTextChange={setShortAnswerText}
                  isAnswered={answerStatus !== 'unanswered'}
                  userAnswer={shortAnswerText}
                  {...passageProps}
                />;
      case QuestionType.WRITING_TASK:
        return <WritingTask question={question} onComplete={handleCompleteTask} />;
      case QuestionType.SPEAKING_TASK:
        return <SpeakingTask question={question} onComplete={handleCompleteTask} />;
      default:
        return <p>Unsupported question type.</p>;
    }
  };
  
  const getFeedbackClass = () => {
      if (answerStatus === 'correct') return 'bg-green-100/80';
      if (answerStatus === 'incorrect') return 'bg-red-100/80';
      return '';
  }
  
  const getFeedbackInfo = () => {
      if (answerStatus === 'correct') {
          return { title: 'Excellent!', color: 'text-brand-green', buttonVariant: 'success' as const };
      }
      if (answerStatus === 'incorrect') {
           return { title: 'Let\'s review.', color: 'text-brand-red', buttonVariant: 'danger' as const };
      }
      return null;
  }

  const renderTranscript = () => {
    if (!currentQuestion.transcript || !currentQuestion.transcriptHighlight) return null;
    
    const transcript = currentQuestion.transcript;
    const highlight = currentQuestion.transcriptHighlight;
    const index = transcript.toLowerCase().indexOf(highlight.toLowerCase());

    if (index === -1) {
        return <p className="text-brand-gray-900">{transcript}</p>;
    }

    const before = transcript.substring(0, index);
    const highlightedText = transcript.substring(index, index + highlight.length);
    const after = transcript.substring(index + highlight.length);

    return (
        <p className="text-brand-gray-900 font-medium">
            {before}
            <strong className="text-brand-blue font-bold p-1 rounded bg-blue-200/50">{highlightedText}</strong>
            {after}
        </p>
    );
  };
  
  const renderPassageHighlight = () => {
    if (!currentQuestion.passage || !currentQuestion.passageHighlight) return null;

    const passage = currentQuestion.passage;
    const highlight = currentQuestion.passageHighlight;
    const index = passage.indexOf(highlight);
    const CONTEXT_LENGTH = 80;

    if (index === -1) {
      return <p className="text-brand-gray-900 font-medium">Highlight not found in text.</p>;
    }

    const startIndex = Math.max(0, index - CONTEXT_LENGTH);
    const endIndex = Math.min(passage.length, index + highlight.length + CONTEXT_LENGTH);

    const snippet = passage.substring(startIndex, endIndex);
    const highlightIndexInSnippet = snippet.indexOf(highlight);

    const before = snippet.substring(0, highlightIndexInSnippet);
    const highlightedText = highlight;
    const after = snippet.substring(highlightIndexInSnippet + highlight.length);

    const isCorrect = answerStatus === 'correct';

    return (
        <p className="text-brand-gray-900 font-medium">
            {startIndex > 0 ? '...' : ''}
            {before}
            <strong className={`font-bold p-1 rounded ${isCorrect ? 'bg-green-200/60 text-green-900' : 'bg-red-200/60 text-red-900'}`}>
                {highlightedText}
            </strong>
            {after}
            {endIndex < passage.length ? '...' : ''}
        </p>
    );
  };

  const feedback = getFeedbackInfo();
  
  const isCheckButtonDisabled = () => {
    if (currentQuestion.type === QuestionType.MULTIPLE_CHOICE) {
      return selectedMcqOptions.length === 0;
    }
    if (currentQuestion.type === QuestionType.SHORT_ANSWER) {
      return shortAnswerText.trim() === '';
    }
    return true; // Disable for tasks handled internally
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
       <header className="p-4 flex items-center gap-4">
            <button onClick={onExit} className="text-2xl text-brand-gray-400 hover:text-brand-gray-500">&times;</button>
            <ProgressBar current={currentQuestionIndex + 1} total={questionsInPart.length} />
       </header>

       <main className="flex-grow p-4 md:p-8 overflow-y-auto">
            {currentQuestion ? renderQuestion(currentQuestion) : <p>Lesson complete!</p>}
       </main>

        <div className="h-44"/> {/* Spacer to prevent content from being hidden by the footer */}

        <footer className="fixed bottom-0 left-0 right-0">
             <div className="max-w-4xl mx-auto">
                {answerStatus !== 'unanswered' && (
                        <div className={`p-6 transition-all duration-300 ${getFeedbackClass()}`}>
                             <div className={`border-t-2 ${feedback?.buttonVariant === 'success' ? 'border-brand-green' : 'border-brand-red'}`}>
                                <div className="flex justify-between items-center pt-4">
                                    {feedback && <h2 className={`text-2xl font-black ${feedback.color}`}>{feedback.title}</h2>}
                                    <div className="w-1/2 md:w-1/3">
                                    <Button onClick={handleNext} variant={feedback?.buttonVariant || 'primary'}>
                                            Continue
                                        </Button>
                                    </div>
                                </div>
                                {answerStatus === 'incorrect' && currentQuestion.type === QuestionType.SHORT_ANSWER && (
                                    <div className="mt-4 pt-4 border-t border-gray-300/80">
                                        <h3 className="font-bold text-sm uppercase tracking-wider text-brand-gray-800 mb-2">Correct Answer(s)</h3>
                                        <p className="font-bold text-brand-green">{currentQuestion.correctAnswers.join(' / ')}</p>
                                    </div>
                                )}
                                {currentQuestion.transcript && (
                                    <div className="mt-4 pt-4 border-t border-gray-300/80">
                                        <h3 className="font-bold text-sm uppercase tracking-wider text-brand-gray-800 mb-2">Transcript</h3>
                                        {renderTranscript()}
                                    </div>
                                )}
                                {currentQuestion.passageHighlight && (
                                    <div className="mt-4 pt-4 border-t border-gray-300/80">
                                        <h3 className="font-bold text-sm uppercase tracking-wider text-brand-gray-800 mb-2">Relevant Text</h3>
                                        {renderPassageHighlight()}
                                    </div>
                                )}
                                {answerStatus === 'incorrect' && currentQuestion.reason && (
                                    <div className="mt-4 pt-4 border-t border-gray-300/80">
                                        <h3 className="font-bold text-sm uppercase tracking-wider text-brand-gray-800 mb-2">Reason</h3>
                                        <p className="text-brand-gray-900 font-medium">{currentQuestion.reason}</p>
                                    </div>
                                )}
                             </div>
                        </div>
                )}

                {answerStatus === 'unanswered' && (currentQuestion?.type === QuestionType.MULTIPLE_CHOICE || currentQuestion?.type === QuestionType.SHORT_ANSWER) && (
                    <div className="p-4 md:px-6 md:py-8 border-t-2 border-brand-gray-200 bg-white">
                    <Button onClick={handleCheckAnswer} disabled={isCheckButtonDisabled()}>
                        Check
                    </Button>
                    </div>
                )}
             </div>
        </footer>
    </div>
  );
};

export default LessonScreen;