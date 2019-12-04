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
import { RandomAvatar, RandomAvatarOptions } from "./AvatarGenerator";
import UserChat from "./UserChat";
const chance = new Chance();

export { RandomAvatar, RandomAvatarOptions };

const randomUsername = chance.word({ length: 6 });
const localStorageUsername = sessionStorage.getItem(
  "messaging-app-user-config-username"
);

const localStorageAvatarOptions = sessionStorage.getItem(
  "messaging-app-user-config-avatarOptions"
);

// re-use the sessionStorage versions of username and avatarOptions
const username = localStorageUsername ? localStorageUsername : randomUsername;
const avatarOptions = localStorageAvatarOptions
  ? JSON.parse(localStorageAvatarOptions)
  : RandomAvatarOptions;

if (!localStorageUsername)
  sessionStorage.setItem("messaging-app-user-config-username", username);
if (!localStorageAvatarOptions)
  sessionStorage.setItem(
    "messaging-app-user-config-avatarOptions",
    JSON.stringify(RandomAvatarOptions)
  );

const socket = new WebSocket(
  `ws://secure-shelf-01153.herokuapp.com?username=${username}&avatarOptions=${JSON.stringify(
    avatarOptions
  )}`
);

export interface IMessageData {
  msg: string;
  recipient: string;
  author: string;
  avatarURL?: string;
  timestamp: string;
}

export interface IClientUser {
  username: string;
  avatar: string;
}

const Main: React.FC = () => {
  const [activeClients, setActiveClients] = useState<IClientUser[]>([]); // This should be in Redux store, will be easier to manage
  const [socketError, setSocketError] = useState<boolean>(false);
  const [activeChat, setActiveChat] = useState<boolean>(false); // This should be in Redux store for the reason below
  const [unreadUsers, setUnreadUsers] = useState<string[]>([]); // This should be in Redux store. Turned off everytime we click that user. Turned on everytime we get a message from that user and we're NOT actively talking to them
  const [messages, updateMessages] = useState<IMessageData[]>([]);
  const [activeRecipient, setActiveRecipient] = useState<{
    // This should be in Redux store
    username: string;
    avatar: string;
  }>({ username: "", avatar: "" });
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
        // case I_CONNECTED // Need new case for when this particular socket has been first acknowledged by the server because in that case the server will bee sending message data
        case "CLIENT_CONNECT": // New User -> this means that the server is updating us to tell us that there is a new kid in the neighborhood and is giving us their username and avatar info so we can render a new entry for them
        case "CLIENT_DISCONNECT":
          setActiveClients(messageData.users);
          break;
        case "CLIENT_NEW":
          console.log(
            "I am a client that JUST connected and here are the messages that the server gave me "
          );
          console.log(messageData.messages);
          setActiveClients(messageData.users);
          updateMessages(messages => [...messages, ...messageData.messages]);
          break;
        case "USER_MESSAGE":
          if (activeRecipient.username !== messageData.author) {
            setUnreadUsers(unreadUsers => [...unreadUsers, messageData.author]);
          }
          // Update with the new message that came in from the user
          updateMessages(messages => [
            ...messages,
            {
              msg: messageData.msg,
              recipient: messageData.recipient,
              author: messageData.author,
              timestamp: messageData.timestamp
            }
          ]);
          break;
      }
    });

    socket.addEventListener("close", function(event) {
      setSocketError(true);
    });
    socket.addEventListener("error", function(event) {
      setSocketError(true);
    });
  }, [activeRecipient.username]);

  return (
    <div className="Main">
      <header className="header">
        <div className="d-flex flex-column">
          <h5>
            Welcome! Your username is <b>{username}</b> and this is your avatar!
          </h5>
          <p>Click on any of the active clients below to chat with them</p>
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
                const decodedAvatarOptionsJSON = JSON.parse(
                  decodeURI(client.avatar)
                );
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
                      updatedUnreadUsersArray.splice(
                        unreadUsers.indexOf(client.username)
                      );
                      setUnreadUsers(updatedUnreadUsersArray);
                    }}
                    key={client.username}
                    // Gray out the person we're currently talking to
                    className={`${
                      client.username === activeRecipient.username
                        ? "user-active"
                        : ""
                    } availableChatUser  ${
                      // Don't show "new" message from a person if we're already talking to that person
                      unreadUsers.includes(client.username) &&
                      client.username !== username
                        ? "unread-user"
                        : ""
                    }`}
                  >
                    <RandomAvatar {...decodedAvatarOptionsJSON} />
                    <p>{client.username}</p>
                  </div>
                );
              })}
          </div>
        </section>
        {activeChat && (
          <section className="chat-section">
            <UserChat
              socket={socket}
              messages={messages.filter(
                message =>
                  message.author === activeRecipient.username ||
                  message.recipient === activeRecipient.username
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
