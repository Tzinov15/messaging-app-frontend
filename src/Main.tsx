/*

TODO: Fix the CSS grid and responsive positioning of everything to not look bad
      - Mobile responsiveness (have available chat icons go to the top in a horizontally scrolling sliver on small devices, main chat screen below that)
                              (have available chat icons go to the left in a grid like pattern, chat screen goes to the right)
      - Surface errors up to the UI from the socket message such as connection errors, DB errrors, etc
      - Unread users and notifications need to be fixed
      - Logic around localStorage setting/reading can be put into a separate function to clean this up

*/

import React, { useEffect, useState } from "react";
import "./App.css";
import Chance from "chance";
import { RandomAvatar, RandomAvatarOptions, AvatarProps } from "./AvatarGenerator";
import UserChat from "./UserChat";
const chance = new Chance();

const randomUsername = chance.word({ length: 6 });
const localStorageUsername = localStorage.getItem("messaging-app-user-config-username");

const localStorageAvatarOptions = localStorage.getItem("messaging-app-user-config-avatarOptions");

// re-use the localStorage versions of username and avatarOptions
export const username = localStorageUsername ? localStorageUsername : randomUsername;
export const avatarOptions = localStorageAvatarOptions ? JSON.parse(localStorageAvatarOptions) : RandomAvatarOptions;

if (!localStorageUsername) localStorage.setItem("messaging-app-user-config-username", username);
if (!localStorageAvatarOptions)
  localStorage.setItem("messaging-app-user-config-avatarOptions", JSON.stringify(RandomAvatarOptions));

const socket = new WebSocket(
  `ws://secure-shelf-01153.herokuapp.com?username=${username}&avatarOptions=${JSON.stringify(avatarOptions)}`
);

export interface IClientUser {
  username: string;
  avatar: AvatarProps;
}

// Shape of the data that comes in to a client from the Server
// See IOutgoingMessageData on the Server
export interface IIncomingMessageData {
  author: string;
  recipient: string;
  msg: string;
  timestamp: string;
  action: "USER_MESSAGE";
  avatarOptions: AvatarProps;
}

// Shape of the data that comes in to a client from the Server
// See IOutgoingMessageData on the Server
export interface IIncomingMessageData {
  author: string;
  recipient: string;
  msg: string;
  timestamp: string;
  action: "USER_MESSAGE";
  avatarOptions: AvatarProps;
}

export interface IIncomingNewClientData {
  action: "CLIENT_NEW";
  messages: IIncomingMessageData[];
  users: IClientUser[];
}

export interface IIncomingConnectedClientData {
  action: "CLIENT_CONNECT" | "CLIENT_DISCONNECT";
  users: IClientUser[];
}

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
    });

    // Listen for messages
    socket.addEventListener("message", function(event) {
      const messageData: IIncomingMessageData | IIncomingConnectedClientData | IIncomingNewClientData = JSON.parse(
        event.data
      );
      switch (messageData.action) {
        // case I_CONNECTED // Need new case for when this particular socket has been first acknowledged by the server because in that case the server will bee sending message data
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

  return (
    <div className="Main">
      <header className="header">
        <div className="">
          <p className="mb-0">
            Welcome! Your username is <b>{username}</b> and this is your avatar!
          </p>
          <p className="mb-0" style={{ fontSize: ".90rem", color: "#21242b" }}>
            Click on any of the active clients below to chat with them
          </p>
        </div>
        <RandomAvatar {...avatarOptions} />
        {socketError && <h1 className="text-danger">SOCKET ERROR</h1>}
      </header>
      <main className="body-content">
        <section className="available-users-section">
          <h4 className="mb-3">Available Connected Clients:</h4>
          <div className="mt-3 avatar-grid ">
            {activeClients
              .filter(client => client.username !== username)
              .map(client => {
                return (
                  <div
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
        {activeChat && activeRecipient && (
          <section className="chat-section">
            <UserChat
              socket={socket}
              messages={messages.filter(
                message => message.author === activeRecipient.username || message.recipient === activeRecipient.username
              )}
              updateMessages={updateMessages}
              author={username}
              recipient={activeRecipient}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default Main;
