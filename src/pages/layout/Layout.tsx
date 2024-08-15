import { Outlet, NavLink, Link } from "react-router-dom";

import { DefaultButton, IButtonProps } from "@fluentui/react/lib/Button";
import { TeachingBubble, ITeachingBubbleStyles } from "@fluentui/react/lib/TeachingBubble";
import { DirectionalHint } from "@fluentui/react/lib/Callout";

import mekav2 from "../../assets/2.jpg";
import styles from "./Layout.module.css";
// import subjectData from "./../../access.json";
import { useMsal } from "@azure/msal-react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import React from "react";
import { IPublicClientApplication, PublicClientApplication } from "@azure/msal-browser";
import { Avatar, Container, IconButton, Typography } from "@mui/material";

interface LayoutProps {
    username: string;
    accessRoles: string[];
    subjectData: { [key: string]: string };
}
const TypeDefaultButton = DefaultButton as any;
const Layout: React.FC<LayoutProps> = ({ username, accessRoles, subjectData }) => {
    const buttonId = useId("targetButton");
    const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(false);
    const { instance } = useMsal();

    const examplePrimaryButtonProps: IButtonProps = {
        children: "Sign-Out",
        onClick: () => handleSignOut(instance as PublicClientApplication)
    };

    const handleSignOut = (msalInstance: PublicClientApplication) => {
        // Call the logout method to sign the user out and clear the session
        msalInstance.logoutRedirect();
    };

    const exampleSecondaryButtonProps: IButtonProps = React.useMemo(
        () => ({
            children: "Close",
            onClick: toggleTeachingBubbleVisible
        }),
        [toggleTeachingBubbleVisible]
    );

    const stylesTeachingBubble: Partial<ITeachingBubbleStyles> = {
        content: {
            // border: "1px solid black",
            background: "white"
        },
        headline: {
            color: "black"
        },
        subText: {
            color: "black"
        },
        footer: {
            [`& > .ms-StackItem`]: {
                display: "flex",
                flexDirection: "row-reverse"
            },
            [`& > .ms-StackItem > .ms-Button:not(:first-child)`]: {
                margin: "0 15px 0 0"
            }
        }
    };
    const subjects = accessRoles.map(role => subjectData[role]);

    // console.log("username:", username);
    // console.log("accessRoles:", accessRoles);
    // console.log("subject:", subjects);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <Container maxWidth="xl">
                    <div className={styles.headerContainer}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                // display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                                marginLeft: "50px"
                            }}
                            className={styles.logo}
                        >
                            LOGO
                        </Typography>
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h4 className={styles.headerTitle}>MSC Metro Systems Corporation</h4>

                            <h6 className={styles.subHeaderTitle}>
                                Watson Assistant - Knowledge Discovery <strong>by MSC</strong>{" "}
                            </h6>
                        </Link>
                        <div className={styles.logoColumn}>
                            <IconButton sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src={mekav2} />
                            </IconButton>
                            {/* <a href="{}" target={"_blank"} title="Mekav link">
                            <img src={mekav} alt="MekaV logo" aria-label="Link to MekaV" className={styles.githubLogo} />
                        </a> */}
                        </div>
                        <div className={styles.buttonColumn}>
                            <TypeDefaultButton
                                id={buttonId}
                                className={styles.DefaultButton}
                                onClick={toggleTeachingBubbleVisible}
                                text={teachingBubbleVisible ? username : username}
                            />

                            {teachingBubbleVisible && (
                                <TeachingBubble
                                    calloutProps={{ directionalHint: DirectionalHint.bottomCenter }}
                                    target={`#${buttonId}`}
                                    primaryButtonProps={examplePrimaryButtonProps}
                                    secondaryButtonProps={exampleSecondaryButtonProps}
                                    onDismiss={toggleTeachingBubbleVisible}
                                    headline="You can access data source."
                                    styles={stylesTeachingBubble}
                                >
                                    <ul>
                                        {subjects.map((subject, index) => (
                                            <li key={index}>{subject}</li>
                                        ))}
                                    </ul>
                                </TeachingBubble>
                            )}
                        </div>
                    </div>
                </Container>
            </header>
            <div className={styles.subHeader}>
                <Container maxWidth="lg">
                    <nav className={styles.subHeaderContainer} style={{ display: "flex", justifyContent: "flex-start", alignItems: "start", width: "100%" }}>
                        <ul className={styles.headerNavList}>
                            <li style={{ marginRight: "10px" }}>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Internal Data Sources
                                </NavLink>
                            </li>
                            <li style={{ marginLeft: "10px" }}>
                                <NavLink to="/external" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    External Data Sources
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </Container>
            </div>
            <Outlet />
        </div>
    );
};

export default Layout;
