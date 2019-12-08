import React from "react";
import "./App.css";
import { RandomAvatarMedium, AvatarProps } from "./AvatarGenerator";

interface HeaderProps {
  username: string;
  avatarOptions: AvatarProps;
  error: boolean;
}

const Header: React.FC<HeaderProps> = ({ username, avatarOptions, error }) => {
  console.log("HEADER is rendering...");
  return (
    <header className="header">
      <div className="logo-title">
        <h1 className="mb-0 mr-1 logo-title-text">Messengy</h1>
        <i style={{ fontSize: "2.5rem" }} className="fad fa-comment-dots"></i>
      </div>
      <div className="d-flex flex-row align-items-center">
        <p className="mb-0">
          Welcome,{" "}
          <b data-testid="random-username" style={{ color: "#0ae589" }}>
            {username}!{" "}
          </b>
          This is your avatar! <br />
          Click on active clients below to chat.
        </p>
        <RandomAvatarMedium {...avatarOptions} />
      </div>
      {error && <h5 className="text-danger">Socket disconnected, refresh to reconnect</h5>}
    </header>
  );
};

export default React.memo(Header);
