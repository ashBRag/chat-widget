import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';

interface MessageInputProps {
  onSend: (text: string, file?: File | null) => void;
  disabled?: boolean;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  background: ${(props) => props.theme.inputBg || '#fff'};
  border-top: 1px solid ${(props) => props.theme.inputBorder || '#e5e7eb'};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
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
  padding: 0 12px;
  font-weight: 600;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  margin-left: 4px;
  &:hover {
    background: #1d4ed8;
  }
`;

const AttachButton = styled.label`
  background: #e5e7eb;
  color: #2563eb;
  border: none;
  border-radius: 12px;
  padding: 0 10px;
  font-size: 1.3rem;
  cursor: pointer;
  margin-right: 8px;
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: center;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px 8px;
  margin-top: 8px;
  font-size: 0.95rem;
`;

const RemoveFile = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  margin-left: 6px;
  cursor: pointer;
  font-size: 1.1rem;
`;

const ImagePreview = styled.img`
  max-width: 120px;
  max-height: 80px;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 1px 4px #0001;
`;

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSend = () => {
    if (value.trim() || file) {
      onSend(value, file);
      setValue('');
      setFile(null);
      setImagePreview(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'].includes(selected.type)) {
      setFileError('Only PDF, JPG, JPEG, PNG allowed');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setFileError('Max file size is 5MB');
      return;
    }
    setFile(selected);
    setFileError(null);
    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(selected);
    } else {
      setImagePreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileError(null);
    setImagePreview(null);
  };

  return (
    <InputContainer>
      <Row>
        <AttachButton title="Attach file">
          📎
          <input
            type="file"
            style={{ display: 'none' }}
            accept=".pdf,image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            disabled={disabled}
          />
        </AttachButton>
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
        <SendButton onClick={handleSend} disabled={disabled || (!value.trim() && !file)} title="Send">
          <span role="img" aria-label="Send">✈️</span>
        </SendButton>
      </Row>
      {file && (
        <FileInfo>
          {file.name}
          <RemoveFile onClick={removeFile} title="Remove file">×</RemoveFile>
        </FileInfo>
      )}
      {imagePreview && (
        <ImagePreview src={imagePreview} alt="Preview" />
      )}
      {fileError && <div style={{ color: '#ef4444', marginTop: 8 }}>{fileError}</div>}
    </InputContainer>
  );
};

export default MessageInput; 