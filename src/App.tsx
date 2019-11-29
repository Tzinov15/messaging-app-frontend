import React, { useEffect, useState } from "react";
import "./App.css";
import Chance from "chance";
import { randomAvatar } from "./AvatarGenerator";
const chance = new Chance();

const socket = new WebSocket("ws://192.168.1.16:9191");
const username = chance.word({ length: 6 });

export interface IMessageData {
  username: string;
  date: string;
  msg: string;
  avatarURL: string;
}
const createMessageElement = (messageData: IMessageData) => {
  const isMyMessage = messageData.username === username;
  return (
    <div
      className="d-flex flex-row align-items-center"
      style={{ opacity: isMyMessage ? 0.5 : 1 }}
    >
      <img width="30px" className="mr-2" src={messageData.avatarURL} />
      <b>[{messageData.username}] </b>{" "}
      <p className="mb-0 mx-3">{messageData.msg}</p>
      <i className="text-secondary">{messageData.date}</i>
    </div>
  );
};

const App: React.FC = () => {
  const [inputValue, changeInputValue] = useState<string>("");
  const [messages, updateMessages] = useState<IMessageData[]>([]);
  const [socketError, setSocketError] = useState<boolean>(false);
  useEffect(() => {
    // Connection opened
    socket.addEventListener("open", function(event) {
      console.log("Hello Server!");
    });

    // Listen for messages
    socket.addEventListener("message", function(event) {
      const messageData = JSON.parse(event.data);
      updateMessages(messages => [...messages, messageData]);
    });

    socket.addEventListener("close", function(event) {
      setSocketError(true);
    });
    socket.addEventListener("error", function(event) {
      setSocketError(true);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <section>
          <h2>{username}</h2>
          <img width="200px" src={randomAvatar} />
        </section>
        <form onSubmit={e => e.preventDefault()}>
          <input
            value={inputValue}
            onChange={e => changeInputValue(e.target.value)}
          ></input>
          <button
            onClick={e =>
              socket.send(
                JSON.stringify({
                  msg: inputValue,
                  username: username,
                  avatarURL: randomAvatar
                })
              )
            }
          >
            Submit Message
          </button>
        </form>
        <div id="message-board">
          <h1>Message Board</h1>
          {socketError && <h2 className="text-danger">SOCKET ERROR</h2>}
          {messages.map(messageData => createMessageElement(messageData))}
        </div>
      </header>
    </div>
  );
};

export default App;
