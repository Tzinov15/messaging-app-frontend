import React from "react";
import "./App.css";
import { RandomAvatar } from "./AvatarGenerator";
import { IClientUser } from "./DataInterfaces";

interface UserAvatarIconProps {
  client: IClientUser;
  index: number;
  isActiveRecipient: boolean;
  hasUnreadUsers: boolean;
  onClick: (client: IClientUser) => void;
}
const UserAvatarIcon: React.FC<UserAvatarIconProps> = ({
  client,
  index,
  isActiveRecipient,
  hasUnreadUsers,
  onClick
}) => (
  <div
    key={client.username}
    data-testid={`user-avatar-${client.username}`}
    tabIndex={index + 1}
    onKeyPress={e => {
      if (e.keyCode === 13 || e.which === 13) onClick(client);
    }}
    onMouseDown={e => {
      e.currentTarget.blur();
      e.preventDefault();
      onClick(client);
    }}
    className={`${isActiveRecipient ? "user-active" : ""} availableChatUser  ${hasUnreadUsers ? "unread-user" : ""}`}
  >
    <RandomAvatar {...client.avatar} />
    <p>{client.username}</p>
  </div>
);

export default React.memo(UserAvatarIcon);
