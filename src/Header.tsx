import React from "react";
import "./App.css";
import { RandomAvatarMedium, RandomAvatarSmall, AvatarProps } from "./AvatarGenerator";
import { useMediaQuery } from "react-responsive";
import { useAuth0 } from "./react-auth0-spa";

interface HeaderProps {
  username: string;
  avatarOptions: AvatarProps;
  error: boolean;
}

const Header: React.FC<HeaderProps> = ({ username, avatarOptions, error }) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const isMobile = useMediaQuery({ query: "(max-width: 870px)" });
  return (
    <header className="header">
      <div className="logo-title">
        <h1 className="mb-0 mr-1 logo-title-text">Messengy</h1>
        <i className="fad fa-comment-dots logo-title-icon"></i>
      </div>
      <div className="d-flex flex-row align-items-center">
        <p className="mb-0 mr-2 welcome-text">
          Welcome,{" "}
          <b data-testid="random-username" style={{ color: "#0ae589" }}>
            {username}!{" "}
          </b>
          This is your avatar! <br />
          Click on active clients below to chat.
        </p>
        {isMobile ? <RandomAvatarSmall {...avatarOptions} /> : <RandomAvatarMedium {...avatarOptions} />}
      </div>
      {error && <h5 className="text-danger">Socket disconnected, refresh to reconnect</h5>}
      <span onClick={() => logout()}>Logout</span>
    </header>
  );
};

export default React.memo(Header);
