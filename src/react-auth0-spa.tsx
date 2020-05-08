// src/react-auth0-spa.js
import React, { useState, useEffect, useContext } from "react";
import createAuth0Client, {
  Auth0Client,
  Auth0ClientOptions,
} from "@auth0/auth0-spa-js";

const DEFAULT_REDIRECT_CALLBACK = (params?: any) =>
  window.history.replaceState({}, document.title, window.location.pathname);

interface ContextValueType {
  isAuthenticated?: boolean;
  user?: any;
  isLoading?: boolean;
  popupOpen?: boolean;
  loginWithPopup?: (...p: any) => void;
  getTokenWithPopup?: (...p: any) => void;
  handleRedirectCallback?: () => void;
  getIdTokenClaims?: (...p: any) => any;
  loginWithRedirect?: (...p: any) => any;
  getTokenSilently?: (...p: any) => any;
  logout?: (...p: any) => any;
}

export const Auth0Context = React.createContext<ContextValueType | null>(null);
export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider: React.FC<{
  children: any;
  onRedirectCallback: (params?: any) => void;
  initOptions: Auth0ClientOptions;
}> = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  initOptions,
}: {
  children: any;
  onRedirectCallback: (params?: any) => void;
  initOptions: Auth0ClientOptions;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  const [isLoading, setIsLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setIsLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client?.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client?.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setIsLoading(true);
    await auth0Client?.handleRedirectCallback();
    const user = await auth0Client?.getUser();
    setIsLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  return auth0Client ? (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p),
      }}
    >
      {children}
    </Auth0Context.Provider>
  ) : null;
};
