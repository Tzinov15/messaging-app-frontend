import React from "react";
import "./App.css";
import { IClientUser } from "./DataInterfaces";
import UserAvatarIcon from "./UserAvatarIcon";

interface AvailableUsersSectionProps {
  activeClients: IClientUser[];
  activeRecipient: IClientUser | null;
  unreadUsers: string[];
  myUsername: string;
  onUserIconClick: (client: IClientUser) => void;
}

const AvailableUsersSection: React.FC<AvailableUsersSectionProps> = ({
  activeClients,
  activeRecipient,
  unreadUsers,
  myUsername,
  onUserIconClick
}) => (
  <section className="available-users-section">
    <p className="mb-3">Available Connected Clients:</p>
    <div className="mt-3 avatar-grid ">
      {activeClients
        .filter(client => client.username !== myUsername)
        .map((client, index) => {
          const isActiveRecipient = Boolean(activeRecipient && client.username === activeRecipient.username);
          const hasUnreadUsers = unreadUsers.includes(client.username) && client.username !== myUsername;
          const userAvatarIconProps = {
            isActiveRecipient,
            hasUnreadUsers,
            index,
            client,
            onClick: onUserIconClick
          };
          return <UserAvatarIcon key={client.username} {...userAvatarIconProps} />;
        })}
    </div>
  </section>
);

export default React.memo(AvailableUsersSection);
