import React from "react";
import { useAuth0 } from "./react-auth0-spa";

import history from "./utils/history";

const LoginPage = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="loginPage">
      <div className="logo-title-login">
        <span>welcome to</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 className="mb-0 mr-1 logo-title-text-login">Messengy</h1>
          <i className="fad fa-comment-dots logo-title-icon-login"></i>
        </div>
        {!isAuthenticated ? (
          <button
            data-testid="chat-button-submit"
            className="ml-2 login-button"
            onClick={(e) => {
              loginWithRedirect({});
            }}
          >
            Login
          </button>
        ) : (
          <button
            data-testid="chat-button-submit"
            className="ml-2 login-button"
            onClick={(e) => {
              history.push("/home");
            }}
          >
            Go to app
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
