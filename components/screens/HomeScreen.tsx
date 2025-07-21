
import React from 'react';
import type { Book } from '../../types';

interface HomeScreenProps {
  books: Book[];
  onSelectBook: (bookId: number) => void;
  isDevMode: boolean;
  onToggleDevMode: () => void;
}

const BookCard: React.FC<{ book: Book; onClick: () => void }> = ({ book, onClick }) => {
  const isFeatured = book.id === 19;

  const colorClasses = isFeatured 
    ? {
        border: 'border-brand-purple',
        text: 'text-brand-purple',
        tag: 'bg-brand-purple text-white'
      }
    : {
        border: 'border-brand-blue',
        text: 'text-brand-blue',
        tag: 'bg-brand-blue text-white'
      };
  
  const icon = (
    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClasses.tag}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C2.057 15.71 3.245 16 4.5 16c1.255 0 2.443-.29 3.5-.804V12.25a.75.75 0 011.5 0v2.946c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C17.943 4.29 16.755 4 15.5 4c-1.255 0-2.443.29-3.5.804V8.75a.75.75 0 01-1.5 0V4.804z" />
        </svg>
    </div>
  );

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-6 transition-all duration-300 cursor-pointer border-t-2 border-x-2 border-b-8 hover:border-b-[10px] hover:-translate-y-1 ${isFeatured ? 'border-brand-purple' : 'border-brand-gray-200 hover:border-brand-blue'}`}
    >
      {isFeatured && <div className="absolute top-0 right-4 px-3 py-1 bg-brand-yellow text-yellow-900 font-bold text-xs rounded-b-lg">FEATURED</div>}
      
      <div className="flex items-start gap-4">
        {icon}
        <div className="flex-1">
          <div className={`tracking-wide text-sm ${colorClasses.text} font-bold`}>
              {isFeatured ? `Official Cambridge IELTS ${book.id}` : `Practice Book ${book.id}`}
          </div>
          <h2 className="block mt-1 text-xl leading-tight font-extrabold text-brand-gray-900">{book.title}</h2>
        </div>
      </div>
      <p className="mt-4 text-brand-gray-800">{book.description}</p>
    </div>
  );
};


const HomeScreen: React.FC<HomeScreenProps> = ({ books, onSelectBook, isDevMode, onToggleDevMode }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-black text-brand-gray-900 tracking-tight">IELTS Lingua</h1>
        <p className="mt-3 text-lg text-brand-gray-800">Choose a book to start your learning path.</p>
        <div className="mt-6 flex justify-center items-center space-x-2">
            <span className="text-sm font-semibold text-brand-gray-800">Developer Mode</span>
            <label htmlFor="devModeToggle" className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="devModeToggle" className="sr-only peer" checked={isDevMode} onChange={onToggleDevMode} />
                <div className="w-11 h-6 bg-brand-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-blue-dark peer-checked:bg-brand-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-brand-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
        </div>
      </header>
      <main className="grid gap-6 md:grid-cols-2">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onClick={() => onSelectBook(book.id)} />
        ))}
      </main>
    </div>
  );
};

export default HomeScreen;