import React, { useEffect, useState } from "react";
import "./App.css";
import Chance from "chance";
import { randomAvatar } from "./AvatarGenerator";
const chance = new Chance();

const username = chance.word({ length: 6 });
const socket = new WebSocket(
  `ws://localhost:9191?username=${username}&avatarURL=${randomAvatar}`
);

export interface IMessageData {
  username: string;
  date: string;
  msg: string;
  avatarURL: string;
}

export interface IClientUser {
  username: string;
  avatar: string;
}

const Main: React.FC = () => {
  const [activeClients, setActiveClients] = useState<IClientUser[]>([]);
  const [socketError, setSocketError] = useState<boolean>(false);
  useEffect(() => {
    // Connection opened
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
          setActiveClients(messageData.users);
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

  return (
    <div className="App">
      <header className="App-header">
        <section>
          <h2>{username}</h2>
          <img width="200px" src={randomAvatar} />
          {socketError && <h1 className="text-danger">SOCKET ERROR</h1>}
        </section>
        <section className="px-3 w-100">
          <h1 className="mb-3">Available Connected Clients:</h1>
          <div className="mt-3 d-flex flex-row align-items-center justify-content-around mx-2">
            {activeClients
              .filter(client => client.username !== username)
              .map(client => {
                return (
                  <div key={client.username} className="availableChatUser">
                    <img height="100px" src={client.avatar} />
                    <p>{client.username}</p>
                  </div>
                );
              })}
          </div>
        </section>
      </header>
    </div>
  );
};

export default Main;
