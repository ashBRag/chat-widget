import React from 'react';

interface TypingIndicatorProps {
  isTyping: boolean;
}

const bounce = [
  'animate-bounce',
  '[animation-delay:0s]',
  '[animation-delay:0.2s]',
  '[animation-delay:0.4s]'
];

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isTyping }) => {
  if (!isTyping) return null;
  return (
    <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-zinc-800 min-h-[32px]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-gray-400 rounded-full w-2 h-2 mx-0.5 ${bounce[0]}`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator; 