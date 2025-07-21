import React from 'react';
import { Book, Lesson } from '../../types';
import CircleNode from '../ui/CircleNode';

interface ChapterScreenProps {
  book: Book;
  onSelectLesson: (lessonId: string) => void;
  onBack: () => void;
  lessonProgress: Record<string, number>;
  isDevMode: boolean;
}

const TestDivider: React.FC<{ testNumber: number }> = ({ testNumber }) => (
    <div className="relative w-full flex justify-center items-center my-6 z-10">
        <div className="bg-white px-4">
            <div className="bg-brand-purple shadow-xl rounded-2xl flex items-center gap-4 py-4 px-8 transform transition hover:scale-105">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06l-3.109 3.108-1.59-1.59a.75.75 0 00-1.06 1.061l2.121 2.12a.75.75 0 001.06 0l3.64-3.639z" clipRule="evenodd" /></svg>
                <h2 className="text-white text-xl font-extrabold uppercase tracking-widest">
                    Test {testNumber}
                </h2>
            </div>
        </div>
    </div>
);

const EndOfBookNode: React.FC = () => (
    <div className="relative z-10 flex justify-center py-8">
        <div className="flex flex-col items-center gap-3 text-center">
            <svg width="120" height="120" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
              <defs>
                <linearGradient id="chest-gold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffca28"/>
                  <stop offset="100%" stopColor="#ff8f00"/>
                </linearGradient>
                <linearGradient id="chest-wood" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8d6e63"/>
                  <stop offset="100%" stopColor="#5d4037"/>
                </linearGradient>
              </defs>
              {/* Lid */}
              <path d="M8,26 C8,18 56,18 56,26 L60,32 L4,32 Z" fill="url(#chest-wood)" stroke="#3e2723" strokeWidth="2"/>
              {/* Lid band */}
              <rect x="6" y="28" width="52" height="6" fill="url(#chest-gold)" stroke="#c77b00" strokeWidth="1.5"/>
              {/* Box */}
              <rect x="2" y="32" width="60" height="28" rx="2" ry="2" fill="url(#chest-wood)" stroke="#3e2723" strokeWidth="2"/>
              {/* Box bands */}
              <path d="M2,32 L2,60 M62,32 L62,60" stroke="url(#chest-gold)" strokeWidth="4" />
              <path d="M12,32 L12,60 M52,32 L52,60" stroke="url(#chest-gold)" strokeWidth="4" />
              {/* Lock */}
              <circle cx="32" cy="42" r="6" fill="url(#chest-gold)" stroke="#c77b00" strokeWidth="1.5"/>
              <rect x="29" y="46" width="6" height="6" fill="#3e2723"/>
            </svg>
             <h3 className="text-2xl font-black text-brand-yellow-dark">
                Book Complete
            </h3>
             <p className="text-md font-bold text-brand-gray-800 max-w-xs">
                You've finished all the lessons in this book. Great work!
            </p>
        </div>
    </div>
);


const ChapterScreen: React.FC<ChapterScreenProps> = ({ book, onSelectLesson, onBack, lessonProgress, isDevMode }) => {
  const firstIncompleteIndex = book.lessons.findIndex(l => (lessonProgress[l.id] || 0) < l.parts.length);
  const activeLessonIndex = firstIncompleteIndex === -1 ? book.lessons.length : firstIncompleteIndex;

  return (
    <div className="p-4 sm:p-6">
      <header className="flex items-center mb-8 sticky top-0 bg-white/80 backdrop-blur-sm z-20 py-4 -mx-4 px-4 border-b border-brand-gray-200">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-gray-200 transition">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="ml-4 text-center flex-grow">
            <h1 className="text-2xl font-extrabold text-brand-gray-900">{book.title}</h1>
        </div>
        <div className="w-8"></div>
      </header>

      <main className="relative py-4">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-brand-gray-200 z-0" />

        <div className="space-y-10">
          {book.lessons.map((lesson, index) => {
            const totalParts = lesson.parts.length;
            const completedParts = lessonProgress[lesson.id] || 0;
            const isCompleted = totalParts > 0 && completedParts >= totalParts;
            const isPlaceholder = totalParts === 0;

            const isLocked = isDevMode ? false : index > activeLessonIndex;
            const isCurrent = index === activeLessonIndex;

            const isNewTest = index % 6 === 0;

            return (
              <React.Fragment key={lesson.id}>
                {isNewTest && <TestDivider testNumber={(index / 6) + 1} />}
                <div className="relative z-10 flex justify-center">
                    <CircleNode
                      lesson={lesson}
                      onClick={() => onSelectLesson(lesson.id)}
                      isLocked={isLocked || isPlaceholder}
                      isCompleted={isCompleted}
                      isCurrent={isCurrent}
                      completedParts={completedParts}
                      totalParts={totalParts}
                    />
                </div>
              </React.Fragment>
            );
          })}
          <EndOfBookNode />
        </div>
      </main>
    </div>
  );
};

export default ChapterScreen;