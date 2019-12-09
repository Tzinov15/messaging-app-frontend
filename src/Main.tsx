import React, { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import { avatarOptions, username } from "./manageUserInStorage";
import {
  IClientUser,
  IIncomingConnectedClientData,
  IIncomingMessageData,
  IIncomingNewClientData,
  IIncomingPongMessage
} from "./DataInterfaces";
import UserChat from "./UserChat";
import Header from "./Header";
import AvailableUsersSection from "./AvailableUsersSection";

const socket = new WebSocket(
  `wss://secure-shelf-01153.herokuapp.com?username=${username}&avatarOptions=${JSON.stringify(avatarOptions)}`
);

const Main: React.FC = () => {
  const [activeClients, setActiveClients] = useState<IClientUser[]>([]); // This should be in Redux store, will be easier to manage
  const [socketError, setSocketError] = useState<boolean>(false);
  const [activeChat, setActiveChat] = useState<boolean>(true); // This should be in Redux store for the reason below
  const [unreadUsers, setUnreadUsers] = useState<string[]>([]); // This should be in Redux store. Turned off everytime we click that user. Turned on everytime we get a message from that user and we're NOT actively talking to them
  const [messages, updateMessages] = useState<IIncomingMessageData[]>([]);
  const [activeRecipient, setActiveRecipient] = useState<IClientUser | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let pingPongInterval: NodeJS.Timer;
    socket.addEventListener("open", function(event) {
      pingPongInterval = setInterval(() => {
        socket.send(JSON.stringify({ action: "PING" }));
      }, 10000);
    });

    socket.addEventListener("close", function(event) {
      setSocketError(true);
    });
    socket.addEventListener("error", function(event) {
      setSocketError(true);
    });
    return function cleanup() {
      socket.close();
      clearInterval(pingPongInterval);
    };
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const messageData:
        | IIncomingMessageData
        | IIncomingConnectedClientData
        | IIncomingNewClientData
        | IIncomingPongMessage = JSON.parse(event.data);
      switch (messageData.action) {
        // case I_CONNECTED // Need new case for when this particular socket has been first acknowledged by the server because in that case the server will bee sending message data
        case "PONG":
          break;
        case "CLIENT_CONNECT": // New User -> this means that the server is updating us to tell us that there is a new kid in the neighborhood and is giving us their username and avatar info so we can render a new entry for them
          setActiveClients(messageData.users);
          break;
        case "CLIENT_DISCONNECT":
          setActiveClients(messageData.users);
          if (activeRecipient && activeRecipient.username === messageData.updatedClient) {
            setActiveChat(false);
            setActiveRecipient(null);
          }
          break;
        case "CLIENT_NEW":
          setActiveClients(messageData.users);
          updateMessages(messages => [...messages, ...messageData.messages]);
          break;
        case "USER_MESSAGE":
          // If we're not currently talking to anyone, add the incoming author to the list of unreads
          if (!activeRecipient) {
            setUnreadUsers(unreadUsers => [...unreadUsers, messageData.author]);
          }

          // If we are talking to someone but it's not who this new message came from, add the new messages author to the list of unreads
          if (activeRecipient && activeRecipient.username !== messageData.author && messageData.author !== username) {
            setUnreadUsers(unreadUsers => [...unreadUsers, messageData.author]);
          }
          // Update with the new message that came in from the user
          updateMessages(messages => [...messages, messageData]);
          break;
      }
    };
    socket.addEventListener("message", onMessage);

    return function cleanup() {
      socket.removeEventListener("message", onMessage);
    };
  }, [activeRecipient, unreadUsers]);

  const onUserAvatarIconEnter = (client: IClientUser) => {
    setActiveChat(true);
    setActiveRecipient({
      username: client.username,
      avatar: client.avatar
    });
    // TODO: All this logic of updating the unreadusers array needs to be cleaned up, updated
    const updatedUnreadUsersArray = [...unreadUsers];
    updatedUnreadUsersArray.splice(unreadUsers.indexOf(client.username));
    setUnreadUsers(updatedUnreadUsersArray);
    inputRef.current && inputRef.current.focus();
  };

  return (
    <div className="Main">
      <Header username={username} avatarOptions={avatarOptions} error={socketError} />
      <main className="body-content">
        <AvailableUsersSection
          activeClients={activeClients}
          activeRecipient={activeRecipient}
          unreadUsers={unreadUsers}
          myUsername={username}
          onUserIconClick={useCallback(onUserAvatarIconEnter, [])}
        />
        {activeChat && activeRecipient && (
          <UserChat
            socket={socket}
            messages={messages.filter(
              message => message.author === activeRecipient.username || message.recipient === activeRecipient.username
            )}
            updateMessages={updateMessages}
            author={username}
            recipient={activeRecipient}
            inputRef={inputRef}
          />
        )}
      </main>
    </div>
  );
};

export default Main;
