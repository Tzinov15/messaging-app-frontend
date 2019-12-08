import React from "react";
import "./App.css";
import { IIncomingMessageData } from "./DataInterfaces";
import { RandomAvatarSmall } from "./AvatarGenerator";
import moment from "moment";

interface IndividualMessageProps {
  messageData: IIncomingMessageData;
  author: string;
}

const IndividualMessage: React.FC<IndividualMessageProps> = ({ messageData, author }) => {
  const isMyMessage = messageData.author === author;
  const timeFromServer = messageData.timestamp;
  const localTime = moment(timeFromServer)
    .local()
    .format("MMM Do YY, h:mm:ss a");
  return (
    <div
      key={messageData.msg + messageData.timestamp}
      style={{ maxWidth: "80%" }}
      className={`d-flex flex-column justify-content-start my-1 ${
        !isMyMessage ? "align-self-end align-items-end" : "align-items-start"
      }`}
    >
      <div className="d-flex align-items-center justify-content-start">
        <RandomAvatarSmall {...messageData.avatarOptions} />
        <b className="ml-1" style={{ color: isMyMessage ? "white" : "#09d3ac" }}>
          [{messageData.author}]{" "}
        </b>{" "}
        <p className="mb-0 mx-3">{messageData.msg}</p>
      </div>
      <i className="text-secondary">{localTime}</i>
    </div>
  );
};

export default React.memo(IndividualMessage);
