import React, { useEffect, useState, Fragment } from "react";
import "./App.css";
import Chance from "chance";
import { RandomAvatar, RandomAvatarOptions } from "./Main";
import { Socket } from "dgram";
const chance = new Chance();

export interface IMessageData {
  msg: string;
  recipient: string;
  author: string;
  avatarURL: string;
  date: string;
}
const createMessageElement = (messageData: IMessageData) => {
  return (
    <div
      key={messageData.msg + messageData.date}
      className="d-flex flex-row align-items-center"
      // style={{ opacity: isMyMessage ? 0.5 : 1 }}
    >
      <img width="30px" className="mr-2" src={messageData.avatarURL} />
      <b>[{messageData.author}] </b>{" "}
      <p className="mb-0 mx-3">{messageData.msg}</p>
      <i className="text-secondary">{messageData.date}</i>
    </div>
  );
};

const UserChat: React.FC<{
  socket: WebSocket;
  author: string;
  recipient: { username: string; avatar: string };
}> = ({ socket, author, recipient }) => {
  const [inputValue, changeInputValue] = useState<string>("");
  const [messages, updateMessages] = useState<IMessageData[]>([]);
  const [socketError, setSocketError] = useState<boolean>(false);
  useEffect(() => {
    console.log("recipient has changed!");
    updateMessages([]);
  }, [recipient]);
  useEffect(() => {
    socket.addEventListener("open", function(event) {
      console.log("Hello Server!");
    });
    // Listen for messages
    socket.addEventListener("message", function(event) {
      const messageData = JSON.parse(event.data);

      const { action } = messageData;
      switch (action) {
        case "CLIENT_CONNECT":
        case "CLIENT_DISCONNECT":
          break;
        case "USER_MESSAGE":
          console.log("WE HAVE USER MESSAGE");
          console.log(messageData);
          // if it's meant to be sent to us OR if it's written by us
          if (
            messageData.recipient === author ||
            messageData.author === author
          ) {
            updateMessages(messages => [...messages, messageData]);
          }
          break;
      }
    });
    socket.addEventListener("close", function(event) {
      setSocketError(true);
    });
    socket.addEventListener("error", function(event) {
      setSocketError(true);
    });
  }, []);
  const decodedAvatarOptionsJSON = JSON.parse(decodeURI(recipient.avatar));

  return (
    <Fragment>
      <section>
        <h2>Talking to {recipient.username}</h2>
        <RandomAvatar {...decodedAvatarOptionsJSON} />
      </section>
      <form onSubmit={e => e.preventDefault()}>
        <input
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
