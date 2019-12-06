import React, { useState } from "react";
import "./App.css";
import { IIncomingMessageData, IClientUser } from "./DataInterfaces";
import { avatarOptions } from "./manageUserInStorage";
import { AvatarProps, RandomAvatarSmall, RandomAvatar } from "./AvatarGenerator";

// See IIncomingData on the server side
export interface IOutgoingMessageData {
  author: string;
  recipient: string;
  msg: string;
  avatarOptions: AvatarProps;
}

const createMessageElement = (messageData: IIncomingMessageData, author: string) => {
  const isMyMessage = messageData.author === author;
  return (
    <div
      key={messageData.msg + messageData.timestamp}
      className="d-flex flex-row align-items-center"
      style={{ opacity: isMyMessage ? 0.5 : 1 }}
    >
      <RandomAvatarSmall {...messageData.avatarOptions} />
      <b>[{messageData.author}] </b> <p className="mb-0 mx-3">{messageData.msg}</p>
      <i className="text-secondary">{messageData.timestamp}</i>
    </div>
  );
};

const UserChat: React.FC<{
  socket: WebSocket;
  author: string;
  messages: IIncomingMessageData[];
  updateMessages: React.Dispatch<React.SetStateAction<IIncomingMessageData[]>>;
  recipient: IClientUser;
}> = ({ socket, author, recipient, messages }) => {
  const [inputValue, changeInputValue] = useState<string>("");

  return (
    <section className="chat-section" data-testid="user-chat-section">
      <section className="d-flex flex-row align-items-center justify-content-center">
        <h2>Talking to {recipient.username}</h2>
        <RandomAvatar {...recipient.avatar} />
      </section>
      <form onSubmit={e => e.preventDefault()}>
        <input
          data-testid="chat-input"
          className="mb-3"
          value={inputValue}
          onChange={e => changeInputValue(e.target.value)}
        ></input>
        <button
          data-testid="chat-button-submit"
          className="ml-2 submit-chat-button"
          onClick={e => {
            const outgoingMessage: IOutgoingMessageData = {
              msg: inputValue,
              recipient: recipient.username,
              author,
              avatarOptions: avatarOptions
            };
            changeInputValue("");
            socket.send(JSON.stringify(outgoingMessage));
          }}
        >
          Submit Message
        </button>
      </form>
      <div data-testid="message-board" className="message-board">
        {messages.map(messageData => createMessageElement(messageData, author))}
      </div>
    </section>
  );
};

export default UserChat;
