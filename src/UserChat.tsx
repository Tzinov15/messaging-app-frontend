import React from "react";
import "./App.css";
import { IIncomingMessageData, IClientUser } from "./DataInterfaces";
import { RandomAvatarMedium } from "./AvatarGenerator";
import { ChatForm } from "./ChatForm";
import IndividualMessage from "./MessageComponent";

const UserChat: React.FC<{
  socket: WebSocket;
  author: string;
  messages: IIncomingMessageData[];
  updateMessages: React.Dispatch<React.SetStateAction<IIncomingMessageData[]>>;
  recipient: IClientUser;
  inputRef: React.RefObject<HTMLInputElement>;
}> = ({ socket, author, recipient, messages, inputRef }) => {
  const messagesEndRef = React.createRef<HTMLDivElement>();

  const scrollToBottom = () => {
    messagesEndRef.current &&
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" }) &&
      (messagesEndRef.current.scrollTop -= 60);
  };

  return (
    <section className="chat-section" data-testid="user-chat-section">
      <section className="d-flex flex-row align-items-center justify-content-center">
        <p>Talking to {recipient.username}</p>
        <RandomAvatarMedium {...recipient.avatar} />
      </section>
      <div data-testid="message-board" className="message-board">
        {messages.map(messageData => (
          <IndividualMessage messageData={messageData} author={author} />
        ))}
        <div style={{ marginTop: "20px" }} ref={messagesEndRef} />
      </div>
      <ChatForm
        inputRef={inputRef}
        recipient={recipient}
        author={author}
        socket={socket}
        scrollToBottom={scrollToBottom}
      />
    </section>
  );
};

export default UserChat;
