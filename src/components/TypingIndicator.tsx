import React from 'react';
import styled, { keyframes } from 'styled-components';

interface TypingIndicatorProps {
  isTyping: boolean;
}

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const Indicator = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #f3f4f6;
  min-height: 32px;
`;

const Dot = styled.div`
  background: #a1a1aa;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  margin: 0 2px;
  animation: ${bounce} 1.4s infinite both;
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
`;

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isTyping }) => {
  if (!isTyping) return null;
  return (
    <Indicator>
      <Dot />
      <Dot />
      <Dot />
    </Indicator>
  );
};

export default TypingIndicator; 