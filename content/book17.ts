import { Book } from '../types';
import { ielts17Test1Lessons } from './book17-1';
import { ielts17Test2Lessons } from './book17-2';
import { ielts17Test3Lessons } from './book17-3';
import { ielts17Test4Lessons } from './book17-4';

export const book17: Book = {
    id: 17,
    title: 'IELTS 17 Academic',
    description: 'Authentic Practice Tests from Cambridge. The perfect way to practise – EXACTLY like the real exam.',
    lessons: [
        ...ielts17Test1Lessons,
        ...ielts17Test2Lessons,
        ...ielts17Test3Lessons,
        ...ielts17Test4Lessons,
    ],
};
