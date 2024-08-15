import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
// import { initializeIcons } from "@fluentui/react";
//redux setup
import { Provider } from "react-redux";
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { useMsal, MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsalAuthentication } from "@azure/msal-react";
import ErrorPage from "./pages/errorPage/ErrorPage";
// store
import { store } from "./redux-toolkit/store";
import App from '../src/index'
import { msalConfig } from "./auth/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
          <React.StrictMode>
              <Provider store={store}>
                  <MsalProvider instance={msalInstance}>
                  <App />
                  </MsalProvider>
              </Provider>
          </React.StrictMode> as any

);
