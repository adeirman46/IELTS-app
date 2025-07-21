import React from 'react';
import type { CircleNodeProps } from '../../types';
import { SECTION_ICONS, SECTION_COLORS } from '../../constants';

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);

const CrownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-brand-yellow drop-shadow-lg ${className}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
)

const CircleNode: React.FC<CircleNodeProps> = ({ lesson, onClick, isLocked, isCompleted, isCurrent, completedParts, totalParts }) => {
  const colorClass = SECTION_COLORS[lesson.section] || 'bg-brand-gray-300';
  const colorStrokeClass = colorClass.replace('bg-', 'text-');
  
  const isPlaceholder = totalParts === 0;
  const isDisabled = isLocked || isPlaceholder;

  const baseClasses = `relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200`;
  
  let stateClasses = '';
  if (isDisabled) {
      stateClasses = 'bg-brand-gray-200 cursor-not-allowed';
  } else {
      stateClasses = `${colorClass} cursor-pointer hover:scale-105`;
  }

  const handleClick = () => {
    if (!isDisabled) {
      onClick();
    }
  };

  const circumference = 2 * Math.PI * 16;
  const progress = totalParts > 0 ? (completedParts / totalParts) : 0;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {isCurrent && !isDisabled && (
            <div className="absolute -inset-1.5">
                <div className="w-full h-full rounded-full bg-brand-blue opacity-75 animate-ping-slow"></div>
            </div>
        )}
        <button onClick={handleClick} className={`${baseClasses} ${stateClasses}`} disabled={isDisabled}>
            <svg className="absolute w-full h-full transform -scale-x-100" viewBox="0 0 36 36">
              <circle
                className="stroke-current text-brand-gray-300/60"
                strokeWidth="4" fill="none" cx="18" cy="18" r="16"
              />
              {progress > 0 && (
                 <circle
                    className={`stroke-current ${colorStrokeClass}`}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    cx="18" cy="18" r="16"
                    transform="rotate(-90 18 18)"
                  />
              )}
            </svg>

            <div className="absolute inset-0 rounded-full opacity-20 bg-black/10"></div>
            <div className="z-10">{isDisabled ? <LockIcon /> : (SECTION_ICONS[lesson.section] || null)}</div>
        </button>
        {isCompleted && (
           <div className="absolute -top-3 -right-3 transform animate-crown-pop">
            <CrownIcon />
          </div>
        )}
        {isCurrent && !isDisabled && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-brand-blue text-white font-bold uppercase text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white">
                    Start
                </div>
            </div>
        )}
      </div>

      <p className={`text-center text-sm font-bold w-28 ${isDisabled ? 'text-brand-gray-400' : 'text-brand-gray-700'}`}>
        {lesson.title}
      </p>
    </div>
  );
};

export default CircleNode;