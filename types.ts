
export enum Section {
  LISTENING = 'Listening',
  READING = 'Reading',
  WRITING = 'Writing',
  SPEAKING = 'Speaking',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  WRITING_TASK = 'WRITING_TASK',
  SPEAKING_TASK = 'SPEAKING_TASK',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

// A base interface to hold common properties
export interface BaseQuestion {
  id: string;
  prompt: string;
  audioUrl?: string;
  passage?: string;
  imageUrl?: string;
  transcript?: string;
  transcriptHighlight?: string;
  passageHighlight?: string;
  reason?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  questionText: string;
  options: string[];
  correctAnswers: string[];
  maxSelections?: number;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: QuestionType.SHORT_ANSWER;
  questionText: string;
  // Use an array to allow for multiple correct variations (e.g., '1990', 'nineteen ninety')
  correctAnswers: string[];
}


export interface WritingTaskQuestion extends BaseQuestion {
  type: QuestionType.WRITING_TASK;
  task: string;
  sampleAnswer?: string;
  sampleAnswerBand?: number;
  examinerComment?: string;
}

export interface SpeakingTaskQuestion extends BaseQuestion {
  type: QuestionType.SPEAKING_TASK;
  question: string;
  sampleAnswer?: string;
}

export type Question = MultipleChoiceQuestion | WritingTaskQuestion | SpeakingTaskQuestion | ShortAnswerQuestion;

export interface LessonPart {
  questions: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  section: Section;
  parts: LessonPart[];
}

export interface Book {
  id: number;
  title:string;
  description: string;
  lessons: Lesson[];
}

export interface CircleNodeProps {
  lesson: Lesson;
  onClick: () => void;
  isLocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  completedParts: number;
  totalParts: number;
}

export interface GeminiWritingSample {
    bandScore: number;
    sampleAnswer: string;
}