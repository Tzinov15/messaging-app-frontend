import React, { useState } from "react";
import { IClientUser, IOutgoingMessageData } from "./DataInterfaces";
import { avatarOptions } from "./manageUserInStorage";

export const ChatForm = ({
  recipient,
  author,
  socket,
  inputRef
}: {
  recipient: IClientUser;
  author: string;
  socket: WebSocket;
  inputRef: React.RefObject<HTMLInputElement>;
}) => {
  const [inputValue, changeInputValue] = useState<string>("");
  inputRef.current && inputRef.current.focus();
  return (
    <form className="input-form-chat mb-3 mt-4 d-flex flex-row align-items-center" onSubmit={e => e.preventDefault()}>
      <input
        data-testid="chat-input"
        ref={inputRef}
        className="flex-grow-1 submit-chat-input"
        autoFocus
        value={inputValue}
        placeholder={`Write message to ${recipient.username}...`}
        onChange={e => {
          changeInputValue(e.target.value);
          if (e.target.value === "") {
            socket.send(
              JSON.stringify({
                action: "NOT_ACTIVELY_TYPING",
                recipient: recipient.username
              })
            );
          }
          if (e.target.value !== "" && recipient.username !== "SERVER") {
            socket.send(
              JSON.stringify({
                action: "ACTIVELY_TYPING",
                recipient: recipient.username,
                currentMessage: e.target.value
              })
            );
          }
        }}
      ></input>
      <button
        data-testid="chat-button-submit"
        className="ml-2 submit-chat-button"
        onClick={e => {
          const outgoingMessage: IOutgoingMessageData = {
            msg: inputValue,
            recipient: recipient.username,
            author,
            avatarOptions: avatarOptions
          };
          changeInputValue("");
          socket.send(JSON.stringify(outgoingMessage));
          if (recipient.username !== "SERVER") {
            socket.send(
              JSON.stringify({
                action: "NOT_ACTIVELY_TYPING",
                recipient: recipient.username
              })
            );
          }
        }}
      >
        Submit Message
      </button>
    </form>
  );
};
