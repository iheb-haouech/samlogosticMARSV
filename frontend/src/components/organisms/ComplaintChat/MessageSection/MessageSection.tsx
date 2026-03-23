import "./MessageSection.scss";
import { useEffect, useRef, useState } from "react";
import Message from "../Message/Message";
import ChatInput from "../ChatInput/ChatInput";
import MessageSectionHeader from "../MessageSectionHeader/MessageSectionHeader";
import { message } from "../../../../types/Complaint";
import { Empty } from "antd";

interface MessageSectionProps {
  messages: message[];
  handleSendMessage: (text: string) => void;
  isAdmin: boolean;
  currentUser: any;
  companyName?: string;
  companyImage?: string;
  trackingNumber: string;
  onDelete: () => void;
  onResolve: () => void;
  handelViewOrderDetails: () => void;
  status: "1" | "3"; // 1 for open and 2 for closed
}
const MessageSection: React.FC<MessageSectionProps> = ({
  messages,
  handleSendMessage,
  isAdmin,
  currentUser,
  companyName,
  companyImage,
  trackingNumber,
  onDelete,
  onResolve,
  handelViewOrderDetails,
  status,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const onSendMessage = () => {
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
      setInputValue("");
    }
  };
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className='message-section'>
      <MessageSectionHeader
        isAdmin={isAdmin}
        companyName={companyName}
        companyImage={companyImage}
        trackingNumber={trackingNumber}
        onDelete={onDelete}
        onResolve={onResolve}
        viewOrderDetails={handelViewOrderDetails}
        status={status}
      />
      <div className='message-section__messages' ref={messageContainerRef}>
        {messages.length != 0 ? (
          messages.map((message) => (
            <Message key={message.id} text={message?.messageContent!} isUser={currentUser?.id === message?.senderId} />
          ))
        ) : (
          <Empty />
        )}
      </div>
      <ChatInput inputValue={inputValue} setInputValue={setInputValue} onSendMessage={onSendMessage} />
    </div>
  );
};

export default MessageSection;
