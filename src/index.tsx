import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
// import { initializeIcons } from "@fluentui/react";
//redux setup
import { Provider } from "react-redux";
// store
import { store } from "./redux-toolkit/store";

import "./index.css";
import { ThemeProvider } from "@mui/material";

// import { AppStateProvider } from './state/AppProvider'

// import Layout from "./pages/layout/Layout";
import LayoutLatest from "./pages/layout/LayoutLatest"
import NoPage from "./pages/NoPage";
import Chat from "./pages/chat/Chat";
import ChatExternal from "./pages/chatExternal/ChatExternal";
import { b2cConfig, msalConfig } from "./auth/authConfig";

import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { useMsal, MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsalAuthentication } from "@azure/msal-react";

// import userData from "./role.json";
// import subjectData from "./access.json";
import ErrorPage from "./pages/errorPage/ErrorPage";
import theme from "./theme/Theme";
import LoginPage from "./pages/login/LoginPage";
import PrivateRoute from "./PrivateRoute";



// initializeIcons();

// async function initializeApp() {
//     try {
//         // const getApi = await fetch(`http://localhost:3000/frontendapi`);
//         const getApi = await fetch(`${process.env.URL_BACKEND}frontendapi`);
//         console.log("🚀 ~ initializeApp ~ getApi:", getApi);
//         if (getApi.status === 200) {
//             const data = await getApi.json();

//             const updatedConfig = {
//                 ...msalConfig,
//                 auth: {
//                     redirectUri: data["APP--FE--REDIRECTURI"],
//                     clientId: data["APP--FE--CLIENTID"],
//                     authority: data["APP--FE--AUTHORITY"]
//                 }
//             };
//             return new PublicClientApplication(updatedConfig);
//         } else {
//             console.log("error call api ----");
//         }
//     } catch {
//         console.log("error call api ----");
//     }
// }

const msalInstanceAD = new PublicClientApplication(msalConfig);
// const msalInstanceB2C = new PublicClientApplication(b2cConfig);



function App() {

    // const handleSignOut = (msalInstance: PublicClientApplication) => {
    //     // Call the logout method to sign the user out and clear the session
    //     msalInstance.logoutRedirect();
    // };
    // const { instance } = useMsal();
    // useMsalAuthentication(InteractionType.Redirect);
     const accounts: any = useMsal().accounts;
    // console.log("🚀 ~ App ~ accounts:", accounts);

    if (accounts.length > 0 && !localStorage.getItem("idToken")) {
        localStorage.setItem("homeAccountId", accounts[0].homeAccountId);
        localStorage.setItem("environment", accounts[0].environment);
        localStorage.setItem("tenantId", accounts[0].tenantId);
        localStorage.setItem("username", accounts[0].username);
        localStorage.setItem("localAccountId", accounts[0].localAccountId);
        localStorage.setItem("name", accounts[0].name);
        localStorage.setItem("idToken", accounts[0].idToken);
        localStorage.setItem("authorityType", accounts[0].authorityType);
        localStorage.setItem("idTokenClaims", JSON.stringify(accounts[0].idTokenClaims));
        localStorage.setItem("authorityType", accounts[0].authorityType);

        // refresh window
        window.location.reload();
    }





    return (
        <React.Fragment>
           
                <ThemeProvider theme={theme}>
                    {/* <UnauthenticatedTemplate>
                        <HashRouter>
                            <Routes>
                                <Route path="/" element={<LoginPage />} />
                            </Routes>
                        </HashRouter>
                    </UnauthenticatedTemplate> */}

                    {/* <AuthenticatedTemplate> */}
                        {/* <HashRouter> */}
                        <HashRouter>
                            <Routes>


                                <Route path="/" element={<PrivateRoute element={<LayoutLatest> <Chat /> </LayoutLatest>} />} />

                                <Route path="external" element={<PrivateRoute element={<LayoutLatest> <ChatExternal /> </LayoutLatest>} />} />


                                <Route path="*" element={<NoPage />} />
                            </Routes>
                        </HashRouter>
                        {/* </HashRouter> */}
                    {/* </AuthenticatedTemplate> */}
                    {/* <UnauthenticatedTemplate>
                <p>No users are signed in!</p>
                <p>
                    <b>Remark</b>
                </p>
                <p>1. If you're using the browser version, click the "GPT - Assistant" tab and select "Open in the new window".</p>
                <p>
                    2. If the login page doesn't appear, try{" "}
                    <a href="https://chatgpt-assistant.azurewebsites.net/" target="_blank">
                        clicking this link
                    </a>{" "}
                    to log in and use the app.
                </p>
                <p>3. If you can't log in, please contact Admin MekhaV.</p>
            </UnauthenticatedTemplate> */}

                </ThemeProvider>
           
        </React.Fragment>
    );
}
export default App
// renderApp();
