import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./Main";
import * as serviceWorker from "./serviceWorker";

import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateComponent";
import { Router, Switch, Route } from "react-router";
import LoginPage from "./LoginPage";

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: any) => {
  history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname);
};

ReactDOM.render(
  <Auth0Provider
    initOptions={{
      domain: config.domain,
      client_id: config.clientId,
      redirect_uri: window.location.origin,
    }}
    onRedirectCallback={onRedirectCallback}
  >
    <div>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={LoginPage}></Route>
          <PrivateRoute path="/home" component={Main} />
        </Switch>
      </Router>
    </div>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
