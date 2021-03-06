import React, { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import { avatarOptions } from "./manageUserInStorage";
import {
  IClientUser,
  IIncomingConnectedClientData,
  IIncomingMessageData,
  IIncomingNewClientData,
  IIncomingPongMessage,
  IIncomingActivelyTypingData,
  IIncomingNotActivelyTypingData,
} from "./DataInterfaces";
import UserChat from "./UserChat";
import Header from "./Header";
import AvailableUsersSection from "./AvailableUsersSection";
import { useAuth0 } from "./react-auth0-spa";

let socket: WebSocket;
const Main: React.FC = () => {
  const [activeClients, setActiveClients] = useState<IClientUser[]>([]); // This should be in Redux store, will be easier to manage
  const { user } = useAuth0();
  const [socketError, setSocketError] = useState<boolean>(false);
  const [activeChat, setActiveChat] = useState<boolean>(true); // This should be in Redux store for the reason below
  const [unreadUsers, setUnreadUsers] = useState<string[]>([]); // This should be in Redux store. Turned off everytime we click that user. Turned on everytime we get a message from that user and we're NOT actively talking to them
  const [messages, updateMessages] = useState<IIncomingMessageData[]>([]);
  const [currentlyTypedMessageFromRecipient, updateCurrentlyTypedMessageFromRecipient] = useState<string | null>(null);
  const [activeRecipient, setActiveRecipient] = useState<IClientUser | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (user === undefined) {
      return;
    }
    let pingPongInterval: NodeJS.Timer;
    socket = new WebSocket(
      `wss://secure-shelf-01153.herokuapp.com?username=${user.email}&avatarOptions=${JSON.stringify(avatarOptions)}`
    );

    socket.addEventListener("open", function (event) {
      pingPongInterval = setInterval(() => {
        socket.send(JSON.stringify({ action: "PING" }));
      }, 10000);
    });

    socket.addEventListener("close", function (event) {
      setSocketError(true);
    });
    socket.addEventListener("error", function (event) {
      setSocketError(true);
    });
    return function cleanup() {
      clearInterval(pingPongInterval);
    };
  }, [user]);

  useEffect(() => {
    return function cleanup() {
      socket.close();
    };
  }, []);

  const handleVisibilityChange = () => {
    if (!document.hidden) document.title = "Messengy";
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange, false);
    return function cleanup() {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    const onMessage = (event: MessageEvent) => {
      const messageData:
        | IIncomingMessageData
        | IIncomingConnectedClientData
        | IIncomingNewClientData
        | IIncomingActivelyTypingData
        | IIncomingNotActivelyTypingData
        | IIncomingPongMessage = JSON.parse(event.data);
      switch (messageData.action) {
        // case I_CONNECTED // Need new case for when this particular socket has been first acknowledged by the server because in that case the server will bee sending message data
        case "ACTIVELY_TYPING":
          updateCurrentlyTypedMessageFromRecipient(messageData.currentMessage);
          break;
        case "NOT_ACTIVELY_TYPING":
          updateCurrentlyTypedMessageFromRecipient(null);
          break;
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
          updateMessages((messages) => [...messages, ...messageData.messages]);
          break;
        case "USER_MESSAGE":
          // If we're not currently talking to anyone, add the incoming author to the list of unreads
          if (document.hidden) {
            document.title = `New message from ${messageData.author}... 🎉`;
          }
          if (!activeRecipient) {
            setUnreadUsers((unreadUsers) => [...unreadUsers, messageData.author]);
          }

          // If we are talking to someone but it's not who this new message came from, add the new messages author to the list of unreads
          if (
            activeRecipient &&
            activeRecipient.username !== messageData.author &&
            messageData.author !== user?.email
          ) {
            setUnreadUsers((unreadUsers) => [...unreadUsers, messageData.author]);
          }
          // Update with the new message that came in from the user
          updateMessages((messages) => [...messages, messageData]);
          break;
      }
    };
    socket.addEventListener("message", onMessage);

    return function cleanup() {
      socket.removeEventListener("message", onMessage);
    };
  }, [activeRecipient, unreadUsers, user]);

  const onUserAvatarIconEnter = (client: IClientUser) => {
    setActiveChat(true);
    setActiveRecipient({
      username: client.username,
      avatar: client.avatar,
    });
    // TODO: All this logic of updating the unreadusers array needs to be cleaned up, updated
    const updatedUnreadUsersArray = [...unreadUsers];
    updatedUnreadUsersArray.splice(unreadUsers.indexOf(client.username));
    setUnreadUsers(updatedUnreadUsersArray);
    inputRef.current && inputRef.current.focus();
  };

  return (
    <div className="Main">
      <Header username={user?.email} avatarOptions={avatarOptions} error={socketError} />
      <main className="body-content">
        <AvailableUsersSection
          activeClients={activeClients}
          activeRecipient={activeRecipient}
          unreadUsers={unreadUsers}
          myUsername={user?.email}
          onUserIconClick={useCallback(onUserAvatarIconEnter, [])}
        />
        {activeChat && activeRecipient && (
          <UserChat
            socket={socket}
            currentlyTypedMessageFromRecipient={currentlyTypedMessageFromRecipient}
            messages={messages.filter(
              (message) => message.author === activeRecipient.username || message.recipient === activeRecipient.username
            )}
            updateMessages={updateMessages}
            author={user?.email}
            recipient={activeRecipient}
            inputRef={inputRef}
          />
        )}
      </main>
    </div>
  );
};

export default Main;
