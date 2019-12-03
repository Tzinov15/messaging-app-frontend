import React, { useEffect, useState, Fragment } from "react";
import "./App.css";
import { RandomAvatar, RandomAvatarOptions, IMessageData } from "./Main";

const createMessageElement = (messageData: IMessageData) => {
  return (
    <div
      key={messageData.msg + messageData.timestamp}
      className="d-flex flex-row align-items-center"
      // style={{ opacity: isMyMessage ? 0.5 : 1 }}
    >
      <img width="30px" className="mr-2" src={messageData.avatarURL} />
      <b>[{messageData.author}] </b>{" "}
      <p className="mb-0 mx-3">{messageData.msg}</p>
      <i className="text-secondary">{messageData.timestamp}</i>
    </div>
  );
};

// TODO: This component should not be handling any socket message receiving etc. That should all be done by Main.tsx and flushed into Redux
const UserChat: React.FC<{
  socket: WebSocket;
  author: string;
  messages: IMessageData[];
  updateMessages: React.Dispatch<React.SetStateAction<IMessageData[]>>;
  recipient: { username: string; avatar: string };
}> = ({ socket, author, recipient, messages, updateMessages }) => {
  const [inputValue, changeInputValue] = useState<string>("");
  const [socketError, setSocketError] = useState<boolean>(false);
  const decodedAvatarOptionsJSON = JSON.parse(decodeURI(recipient.avatar));

  return (
    <Fragment>
      <section>
        <h2>Talking to {recipient.username}</h2>
        <RandomAvatar {...decodedAvatarOptionsJSON} />
      </section>
      <form onSubmit={e => e.preventDefault()}>
        <input
          className="mb-3"
          value={inputValue}
          onChange={e => changeInputValue(e.target.value)}
        ></input>
        <button
          onClick={e => {
            changeInputValue("");
            socket.send(
              JSON.stringify({
                msg: inputValue,
                recipient: recipient.username,
                author,
                avatarOptions: RandomAvatarOptions
              })
            );
          }}
        >
          Submit Message
        </button>
      </form>
      <div id="message-board">
        {socketError && <h2 className="text-danger">SOCKET ERROR</h2>}
        {messages.map(messageData => createMessageElement(messageData))}
      </div>
    </Fragment>
  );
};

export default UserChat;
