import React, { useState, useEffect } from 'react';
import type { Book, Lesson } from './types';
import { getBooks, getBook, getLesson } from './services/contentService';
import HomeScreen from './components/screens/HomeScreen';
import ChapterScreen from './components/screens/ChapterScreen';
import LessonScreen from './components/screens/LessonScreen';
import LessonCompleteScreen from './components/screens/LessonCompleteScreen';

type AppState =
  | { view: 'home' }
  | { view: 'chapter'; bookId: number }
  | { view: 'lesson'; bookId: number; lessonId: string; partIndex: number }
  | { view: 'lessonComplete'; bookId: number; score: number; totalQuestions: number };

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ view: 'home' });
  const [books, setBooks] = useState<Book[]>([]);
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({});
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  const handleToggleDevMode = () => {
    setIsDevMode(prev => !prev);
  };
  
  const handleSelectBook = (bookId: number) => {
    setAppState({ view: 'chapter', bookId });
  };
  
  const handleSelectLesson = (lessonId: string) => {
    if (appState.view === 'chapter') {
        const lesson = getLesson(appState.bookId, lessonId);
        if (!lesson) return;
        const currentProgress = lessonProgress[lessonId] || 0;
        const partIndexToStart = currentProgress < lesson.parts.length ? currentProgress : 0;
        setAppState({ view: 'lesson', bookId: appState.bookId, lessonId, partIndex: partIndexToStart });
    }
  };
  
  const handleBackToHome = () => {
    setAppState({ view: 'home' });
  };
  
  const handleLessonPartComplete = (score: number, totalQuestions: number) => {
    if (appState.view === 'lesson') {
      const currentProgress = lessonProgress[appState.lessonId] || 0;
      const newProgress = currentProgress + 1;
      
      const newLessonProgress = { ...lessonProgress, [appState.lessonId]: newProgress };
      
      const book = getBook(appState.bookId);
      const lesson = book?.lessons.find(l => l.id === appState.lessonId);

      if (lesson && newProgress >= lesson.parts.length) {
        let currentIndex = book.lessons.findIndex(l => l.id === appState.lessonId);
        if (currentIndex !== -1) {
          for (let i = currentIndex + 1; i < book.lessons.length; i++) {
            const nextLesson = book.lessons[i];
            if (nextLesson.parts.length === 0) {
              newLessonProgress[nextLesson.id] = 0; 
            } else {
              break;
            }
          }
        }
      }

      setLessonProgress(newLessonProgress);
      setAppState({
        view: 'lessonComplete',
        bookId: appState.bookId,
        score,
        totalQuestions,
      });
    }
  };

  const handleBackToChapter = () => {
      if (appState.view === 'lesson') {
          setAppState({ view: 'chapter', bookId: appState.bookId });
      }
  };

  const handleContinueFromSummary = () => {
    if (appState.view === 'lessonComplete') {
        setAppState({ view: 'chapter', bookId: appState.bookId });
    }
  }

  const renderContent = () => {
    switch (appState.view) {
      case 'home':
        return <HomeScreen 
                  books={books} 
                  onSelectBook={handleSelectBook} 
                  isDevMode={isDevMode}
                  onToggleDevMode={handleToggleDevMode}
                />;
        
      case 'chapter':
        const book = getBook(appState.bookId);
        if (!book) {
            return <p>Book not found. <button onClick={handleBackToHome}>Go Home</button></p>;
        }
        return <ChapterScreen 
                    book={book} 
                    onSelectLesson={handleSelectLesson} 
                    onBack={handleBackToHome}
                    lessonProgress={lessonProgress}
                    isDevMode={isDevMode}
                />;
        
      case 'lesson':
        const lesson = getLesson(appState.bookId, appState.lessonId);
        const part = lesson?.parts[appState.partIndex];

        if (!lesson || !part) {
            return <div className="p-8"><p>Lesson part not available.</p><button onClick={() => setAppState({view: 'chapter', bookId: appState.bookId})} className="text-brand-blue font-bold">Go Back</button></div>;
        }
        return <LessonScreen lesson={lesson} partIndex={appState.partIndex} onComplete={handleLessonPartComplete} onExit={handleBackToChapter} />;
        
      case 'lessonComplete':
        return <LessonCompleteScreen 
                    score={appState.score} 
                    totalQuestions={appState.totalQuestions}
                    onContinue={handleContinueFromSummary}
                />;

      default:
        return <HomeScreen books={books} onSelectBook={handleSelectBook} isDevMode={isDevMode} onToggleDevMode={handleToggleDevMode}/>;
    }
  };

  return (
    <div className="bg-brand-gray-100 min-h-screen font-sans">
      <div className="container mx-auto max-w-2xl bg-white min-h-screen shadow-lg">
          {renderContent()}
      </div>
    </div>
  );
};

export default App;