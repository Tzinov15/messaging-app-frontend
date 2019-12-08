import React from "react";
import "./App.css";
import { RandomAvatar, AvatarProps } from "./AvatarGenerator";

interface HeaderProps {
  username: string;
  avatarOptions: AvatarProps;
  error: boolean;
}

const Header: React.FC<HeaderProps> = ({ username, avatarOptions, error }) => {
  console.log("HEADER is rendering...");
  return (
    <header className="header">
      <div className="">
        <p className="mb-0">
          Welcome! Your username is <b data-testid="random-username">{username}</b> and this is your avatar!
        </p>
        <p className="mb-0" style={{ fontSize: ".90rem", color: "#21242b" }}>
          Click on any of the active clients below to chat with them
        </p>
      </div>
      <RandomAvatar {...avatarOptions} />
      {error && <h5 className="text-danger">Socket disconnected, refresh to reconnect</h5>}
    </header>
  );
};

export default React.memo(Header);
