import React, { useEffect, useState } from "react";
import "./App.css";
import { RandomAvatar, AvatarProps } from "./AvatarGenerator";
import { avatarOptions, username } from "./manageUserInStorage";
import {
  IClientUser,
  IIncomingConnectedClientData,
  IIncomingMessageData,
  IIncomingNewClientData,
  IIncomingPongMessage
} from "./DataInterfaces";
import UserChat from "./UserChat";

const socket = new WebSocket(
  `wss://secure-shelf-01153.herokuapp.com?username=${username}&avatarOptions=${JSON.stringify(avatarOptions)}`
);

const Main: React.FC = () => {
  const [activeClients, setActiveClients] = useState<IClientUser[]>([]); // This should be in Redux store, will be easier to manage
  const [socketError, setSocketError] = useState<boolean>(false);
  const [activeChat, setActiveChat] = useState<boolean>(false); // This should be in Redux store for the reason below
  const [unreadUsers, setUnreadUsers] = useState<string[]>([]); // This should be in Redux store. Turned off everytime we click that user. Turned on everytime we get a message from that user and we're NOT actively talking to them
  const [messages, updateMessages] = useState<IIncomingMessageData[]>([]);
  const [activeRecipient, setActiveRecipient] = useState<IClientUser | null>(null);
  useEffect(() => {
    // Connection opened
    socket.addEventListener("open", function(event) {
      console.log("Hello Server!");

      setInterval(() => {
        socket.send(JSON.stringify({ action: "PING" }));
      }, 10000);
    });

    // Listen for messages
    socket.addEventListener("message", function(event) {
      const messageData:
        | IIncomingMessageData
        | IIncomingConnectedClientData
        | IIncomingNewClientData
        | IIncomingPongMessage = JSON.parse(event.data);
      switch (messageData.action) {
        // case I_CONNECTED // Need new case for when this particular socket has been first acknowledged by the server because in that case the server will bee sending message data
        case "PONG":
          console.log("pong");
          break;
        case "CLIENT_CONNECT": // New User -> this means that the server is updating us to tell us that there is a new kid in the neighborhood and is giving us their username and avatar info so we can render a new entry for them
        case "CLIENT_DISCONNECT":
          setActiveClients(messageData.users);
          break;
        case "CLIENT_NEW":
          setActiveClients(messageData.users);
          updateMessages(messages => [...messages, ...messageData.messages]);
          break;
        case "USER_MESSAGE":
          if (!activeRecipient || activeRecipient.username !== messageData.author) {
            setUnreadUsers(unreadUsers => [...unreadUsers, messageData.author]);
          }
          // Update with the new message that came in from the user
          updateMessages(messages => [...messages, messageData]);
          break;
      }
    });

    socket.addEventListener("close", function(event) {
      setSocketError(true);
    });
    socket.addEventListener("error", function(event) {
      setSocketError(true);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Header = () => (
    <header className="header">
      <div className="">
        <p className="mb-0">
          Welcome! Your username is <b data-testid="random-username">{username}</b> and this is your avatar!
        </p>
        <p className="mb-0" style={{ fontSize: ".90rem", color: "#21242b" }}>
          Click on any of the active clients below to chat with them
        </p>
      </div>
      <RandomAvatar {...avatarOptions} />
      {socketError && <h1 className="text-danger">SOCKET ERROR</h1>}
    </header>
  );

  const AvailableUsersSection = () => (
    <section className="available-users-section">
      <h4 className="mb-3">Available Connected Clients:</h4>
      <div className="mt-3 avatar-grid ">
        {activeClients
          .filter(client => client.username !== username)
          .map(client => {
            return (
              <div
                data-testid={`user-avatar-${client.username}`}
                onClick={() => {
                  setActiveChat(true);
                  setActiveRecipient({
                    username: client.username,
                    avatar: client.avatar
                  });
                  // TODO: All this logic of updating the unreadusers array needs to be cleaned up, updated
                  const updatedUnreadUsersArray = [...unreadUsers];
                  updatedUnreadUsersArray.splice(unreadUsers.indexOf(client.username));
                  setUnreadUsers(updatedUnreadUsersArray);
                }}
                key={client.username}
                // Gray out the person we're currently talking to
                className={`${
                  activeRecipient && client.username === activeRecipient.username ? "user-active" : ""
                } availableChatUser  ${
                  // Don't show "new" message from a person if we're already talking to that person
                  unreadUsers.includes(client.username) && client.username !== username ? "unread-user" : ""
                }`}
              >
                <RandomAvatar {...client.avatar} />
                <p>{client.username}</p>
              </div>
            );
          })}
      </div>
    </section>
  );

  return (
    <div className="Main">
      <Header />
      <main className="body-content">
        <AvailableUsersSection />
        {activeChat && activeRecipient && (
          <UserChat
            socket={socket}
            messages={messages.filter(
              message => message.author === activeRecipient.username || message.recipient === activeRecipient.username
            )}
            updateMessages={updateMessages}
            author={username}
            recipient={activeRecipient}
          />
        )}
      </main>
    </div>
  );
};

export default Main;
