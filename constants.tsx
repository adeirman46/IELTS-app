import React from 'react';
import { Section } from './types';

export const SECTION_ICONS: Record<Section, React.ReactNode> = {
  [Section.LISTENING]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M8.464 15.536a5 5 0 010-7.072" />
    </svg>
  ),
  [Section.READING]: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C2.057 15.71 3.245 16 4.5 16c1.255 0 2.443-.29 3.5-.804V12.25a.75.75 0 011.5 0v2.946c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C17.943 4.29 16.755 4 15.5 4c-1.255 0-2.443.29-3.5.804V8.75a.75.75 0 01-1.5 0V4.804z" />
    </svg>
  ),
  [Section.WRITING]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
    </svg>
  ),
  [Section.SPEAKING]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
};

export const SECTION_COLORS: Record<Section, string> = {
    [Section.LISTENING]: 'bg-brand-blue',
    [Section.READING]: 'bg-brand-green',
    [Section.WRITING]: 'bg-orange-500', // Using a default Tailwind color for variety
    [Section.SPEAKING]: 'bg-brand-red',
};