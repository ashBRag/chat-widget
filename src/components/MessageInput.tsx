import React, { useState } from 'react';
import styled from 'styled-components';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const InputContainer = styled.div`
  display: flex;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f3f4f6;
  margin-right: 8px;
`;

const SendButton = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0 18px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1d4ed8;
  }
`;

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <InputContainer>
      <Input
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSend();
        }}
        disabled={disabled}
      />
      <SendButton onClick={handleSend} disabled={disabled || !value.trim()}>
        Send
      </SendButton>
    </InputContainer>
  );
};

export default MessageInput; 