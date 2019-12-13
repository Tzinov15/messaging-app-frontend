import React, { useEffect, useCallback } from "react";
import "./App.css";
import { IIncomingMessageData, IClientUser } from "./DataInterfaces";
import { RandomAvatarMedium } from "./AvatarGenerator";
import { ChatForm } from "./ChatForm";

import IndividualMessage from "./MessageComponent";

const UserChat: React.FC<{
  socket: WebSocket;
  author: string;
  messages: IIncomingMessageData[];
  currentlyTypedMessageFromRecipient: string | null;
  updateMessages: React.Dispatch<React.SetStateAction<IIncomingMessageData[]>>;
  recipient: IClientUser;
  inputRef: React.RefObject<HTMLInputElement>;
}> = ({ socket, author, recipient, messages, inputRef, currentlyTypedMessageFromRecipient }) => {
  const messagesEndRef = React.createRef<HTMLDivElement>();
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current && messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <section className="chat-section" data-testid="user-chat-section">
      <section className="d-flex flex-row align-items-center justify-content-center">
        <p className="mb-0">Talking to {recipient.username}</p>
        <RandomAvatarMedium {...recipient.avatar} />
      </section>
      <div data-testid="message-board" className="message-board">
        {messages.map(messageData => (
          <IndividualMessage key={messageData.msg + messageData.timestamp} messageData={messageData} author={author} />
        ))}
        <div
          style={{ fontSize: ".75rem" }}
          className={`mt-2 actively-typing-indicator-${
            currentlyTypedMessageFromRecipient ? "present" : "hidden"
          } d-flex flex-row align-items-center`}
        >
          <i className={`fal fa-typewriter mr-1`}></i>
          <i className="">{recipient.username} is actively typing</i>
        </div>
        <div style={{ height: "10px" }} ref={messagesEndRef}></div>
      </div>
      <ChatForm inputRef={inputRef} recipient={recipient} author={author} socket={socket} />
    </section>
  );
};

export default UserChat;
