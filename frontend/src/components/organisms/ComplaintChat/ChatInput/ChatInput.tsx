import React from "react";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import "./ChatInput.scss";
interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ inputValue, setInputValue, onSendMessage }) => {
  return (
    <div className='message-section__input'>
      <div></div>
      {/* <Upload showUploadList={false}>
        <Button icon={<IoImageOutline />} />
      </Upload> */}
      <TextArea
        autoSize={{ minRows: 1, maxRows: 6 }}
        allowClear
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder='Type your message...'
      />
      <Button onClick={onSendMessage}>Envoyer</Button>
    </div>
  );
};

export default ChatInput;
