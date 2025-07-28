import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSend: (text: string, file?: File | null) => void;
  disabled?: boolean;
  value: string;
  setValue : (value: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled, value, setValue }) => {
  //const [value, setValue] = useState('');
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
    <div className="flex flex-col p-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700">
      <div className="flex items-center">
        <label
          className="bg-gray-200 dark:bg-zinc-700 text-blue-600 rounded-xl px-2 text-xl cursor-pointer mr-2 flex items-center h-10 justify-center"
          title="Attach file"
        >
          📎
          <input
            type="file"
            className="hidden"
            accept=".pdf,image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            disabled={disabled}
          />
        </label>
        <input
          type="text"
          placeholder="Type a message..."
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') handleSend();
          }}
          disabled={disabled}
          className="flex-1 border-none outline-none text-base px-3 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 mr-2"
        />
        <button
          onClick={handleSend}
          disabled={disabled || (!value.trim() && !file)}
          title="Send"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center h-10 w-10 ml-1 transition-colors disabled:opacity-50"
        >
          <span role="img" aria-label="Send">✈️</span>
        </button>
      </div>
      {file && (
        <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-lg px-2 py-1 mt-2 text-sm">
          {file.name}
          <button
            onClick={removeFile}
            title="Remove file"
            className="ml-2 text-red-500 text-lg bg-transparent border-none cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="max-w-[120px] max-h-[80px] rounded-lg mt-2 shadow"
        />
      )}
      {fileError && <div className="text-red-500 mt-2 text-sm">{fileError}</div>}
    </div>
  );
};

export default MessageInput; 