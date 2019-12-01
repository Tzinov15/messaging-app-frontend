import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Main from "./Main";
import UserChat from "./UserChat";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/userchat/:username" component={UserChat} />
        <Route path="/" component={Main} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
