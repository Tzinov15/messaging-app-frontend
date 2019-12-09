import React from "react";
import "./App.css";
import { RandomAvatar, RandomAvatarSmall } from "./AvatarGenerator";
import { IClientUser } from "./DataInterfaces";
import { useMediaQuery } from "react-responsive";

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
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 870px)" });
  return (
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
      {isMobile ? <RandomAvatarSmall {...client.avatar} /> : <RandomAvatar {...client.avatar} />}
      <p className="avatar-text">{client.username}</p>
    </div>
  );
};

export default React.memo(UserAvatarIcon);
