import React, { useEffect, useState } from "react";
import "./App.css";
import Chance from "chance";
import { RandomAvatar, RandomAvatarOptions } from "./AvatarGenerator";
import UserChat from "./UserChat";
const chance = new Chance();

export { RandomAvatar, RandomAvatarOptions };

const randomUsername = chance.word({ length: 6 });
const localStorageUsername = localStorage.getItem(
  "messaging-app-user-config-username"
);

const localStorageAvatarOptions = localStorage.getItem(
  "messaging-app-user-config-avatarOptions"
);

// re-use the localStorage versions of username and avatarOptions
const username = localStorageUsername ? localStorageUsername : randomUsername;
const avatarOptions = localStorageAvatarOptions
  ? JSON.parse(localStorageAvatarOptions)
  : RandomAvatarOptions;

if (!localStorageUsername)
  localStorage.setItem("messaging-app-user-config-username", username);
if (!localStorageAvatarOptions)
  localStorage.setItem(
    "messaging-app-user-config-avatarOptions",
    JSON.stringify(RandomAvatarOptions)
  );

const socket = new WebSocket(
  `ws://localhost:9191?username=${username}&avatarOptions=${JSON.stringify(
    avatarOptions
  )}`
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
  const [activeClients, setActiveClients] = useState<IClientUser[]>([]); // This should be in Redux store, will be easier to manage
  const [socketError, setSocketError] = useState<boolean>(false);
  const [activeChat, setActiveChat] = useState<boolean>(false); // This should be in Redux store for the reason below
  const [unreadUsers, setUnreadUsers] = useState<string[]>([]); // This should be in Redux store. Turned off everytime we click that user. Turned on everytime we get a message from that user and we're NOT actively talking to them
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
          break;
        case "USER_MESSAGE":
          console.log("WE HAVE USER MESSAGE");
          console.log(messageData.author);
          console.log("activeRecipient");
          console.log(activeRecipient.username);
          if (activeRecipient.username !== messageData.author) {
            setUnreadUsers(unreadUsers => [...unreadUsers, messageData.author]);
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

  return (
    <div className="Main">
      <header className="App-header">
        <p>
          Hi! Your username is <b>{username}</b>
        </p>
        <RandomAvatar {...avatarOptions} />
        {socketError && <h1 className="text-danger">SOCKET ERROR</h1>}
      </header>
      <section className="body-content">
        <div className="available-users-section">
          <h1 className="mb-3">Available Connected Clients:</h1>
          <div className="mt-3 d-flex flex-row align-items-center justify-content-around mx-">
            {activeClients
              .filter(client => client.username !== username)
              .map(client => {
                const decodedAvatarOptionsJSON = JSON.parse(
                  decodeURI(client.avatar)
                );
                console.log("client.username");
                console.log(client.username);
                console.log("username");
                console.log(username);
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
                    style={{
                      opacity:
                        client.username === activeRecipient.username ? 0.5 : 1
                    }}
                    className={`availableChatUser mx-3 ${
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
        </div>
        {activeChat && (
          <div className="user-chat-section">
            <UserChat
              socket={socket}
              author={username}
              recipient={activeRecipient}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default Main;
