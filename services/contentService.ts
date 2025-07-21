import { Book, Lesson } from '../types';
import { books as contentData } from '../content';


export const getBooks = (): Book[] => {
  return contentData;
};

export const getBook = (id: number): Book | undefined => {
  return contentData.find(book => book.id === id);
}

export const getLesson = (bookId: number, lessonId: string): Lesson | undefined => {
  const book = getBook(bookId);
  return book?.lessons.find(lesson => lesson.id === lessonId);
};