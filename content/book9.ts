import { Book, Lesson, Section } from '../types';

const createPlaceholderLessons = (bookId: number): Lesson[] => {
    const LESSONS_PER_TEST = 6;
    const NUM_TESTS = 4;
    const lessons: Lesson[] = [];

    const sectionSequence = [
        { section: Section.LISTENING, title: 'Listening P1-2' },
        { section: Section.LISTENING, title: 'Listening P3-4' },
        { section: Section.READING, title: 'Reading P1' },
        { section: Section.READING, title: 'Reading P2-3' },
        { section: Section.WRITING, title: 'Writing T1-2' },
        { section: Section.SPEAKING, title: 'Speaking P1-3' },
    ];

    for (let i = 0; i < NUM_TESTS; i++) {
        const testNum = i + 1;
        for (let j = 0; j < LESSONS_PER_TEST; j++) {
            const lessonTemplate = sectionSequence[j];
            lessons.push({
                id: `b${bookId}-t${testNum}-${lessonTemplate.section.toLowerCase().charAt(0)}${j}`,
                title: `Test ${testNum}: ${lessonTemplate.title}`,
                section: lessonTemplate.section,
                parts: [],
            });
        }
    }
    return lessons;
};

export const book9: Book = {
    id: 9,
    title: 'IELTS Practice Book 9',
    description: 'Practice fundamental skills and strategies for the IELTS test.',
    lessons: createPlaceholderLessons(9),
};