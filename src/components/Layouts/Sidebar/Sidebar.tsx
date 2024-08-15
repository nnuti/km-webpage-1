import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import RefreshIcon from "@mui/icons-material/Refresh";
import HistoryIcon from "@mui/icons-material/History";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PostAddIcon from "@mui/icons-material/PostAdd";
import logo from "../../../static/images/metro-logo-main.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "../../../pages/layout/LayoutLatest.module.css";
import { Avatar, Button, Drawer, ListItemAvatar, Menu, MenuItem, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { ChatMessage, historyDelete, historyList, historyRename } from "../../../api";
// import { AppStateContext } from '../../../state/AppProvider'
import { useAppSelector } from "../../../redux-toolkit/hooks";
import { selectHistoryState } from "../../../redux-toolkit/History/history-slice";
import { useLocation, useNavigate } from "react-router-dom";
import stylesCss from './Sidebar.module.css';
import { MdOutlineAutoDelete, MdEditDocument } from "react-icons/md";
import DialogRenameComponent from "../../Dialogs/DialogRenameComponent";
import { formatDuration } from "../../../utills";



const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
    }),
    overflowX: "hidden"
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`
    }
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
}));



const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1
});



const DrawerDesktop = styled(MuiDrawer, { shouldForwardProp: prop => prop !== "open" })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme)
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme)
    })
}));

interface LayoutLatestProps {
    open: boolean;
    handleToggle: () => void;
    isSmallScreen: boolean;
}


export type Conversation = {
    id: string
    title: string
    messages: ChatMessage[]
    date: string
}

function Sidebar(props: LayoutLatestProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { instance } = useMsal();
    const [open, setOpen] = React.useState(false);
    const { toggle } = useAppSelector(selectHistoryState);
    // const appStateContext = React.useContext(AppStateContext)
    // const isSelected = item?.id === appStateContext?.state.currentChat?.id
    const [offset, setOffset] = useState<number>(0)
    const [visibleItems, setVisibleItems] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [editHistoryName, setEditHistoryName] = useState<[string, string]>(["", ""]);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<any>({});


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickMenu = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setMenuAnchorEl({ ...menuAnchorEl, [id]: event.currentTarget });
    };

    const handleCloseMenu = (id: string) => {
        setMenuAnchorEl({ ...menuAnchorEl, [id]: null });
    };

    const handleLogout = () => {
        // console.log("logout");


        handleSignOut(instance as PublicClientApplication);
        localStorage.clear();
        handleClose();
    };

    const handleSignOut = (msalInstance: PublicClientApplication) => {
        // Call the logout method to sign the user out and clear the session
        if (window.opener && !window.opener.closed) {
            // This is a popup window, so we use logoutRedirect to avoid nested popup issues
            msalInstance.logoutRedirect();
        } else {
            // This is the main window, so it's safe to use logoutRedirect or other methods as needed
            msalInstance.logoutRedirect(); // Adjust according to your application's flow
        }
    };

    const handleFetchHistory = async () => {
        setLoading(true)


        const response: any = await historyList(offset, location.pathname === "/" ? "internal" : "external")
        if (response) {
            setVisibleItems(response)
        } else {
            // appStateContext?.dispatch({ type: 'FETCH_CHAT_HISTORY', payload: null })
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        try {



            const resp = await historyDelete(id)
            if (resp.status === 200) {
                const newVisibleItems = visibleItems.filter((item: any) => item.id !== id)
                setVisibleItems(newVisibleItems)
                // check id on url 
                const params = new URLSearchParams(location.search);
                if (params.get('id') == id) {

                    params.delete('id');
                    navigate({ search: params.toString() }, { replace: true });
                    // refresh window
                    window.location.reload();

                }
            }

        } catch (error) {
            console.log();
        }
    }


    const handleShowEditHistoryName = (id: string, name: string) => {
        setEditHistoryName([id, name])
        setMenuAnchorEl({});
        setOpen(true)
    }


    const handleUpdateHistoryName = async () => {
        try {
            const resp = await historyRename(editHistoryName[0], editHistoryName[1])
            if (resp.status === 200) {
                const newVisibleItems = visibleItems.map((item: any) => {
                    if (item.id === editHistoryName[0]) {
                        return { ...item, title: editHistoryName[1] }
                    }
                    return item
                })
                setVisibleItems(newVisibleItems)
            }

            setOpen(false)
        } catch (error) {
            console.log("error", error);

        }
    }

    useEffect(() => {
        handleFetchHistory()
    }, [toggle]);



    const handleHistoryById = (id: string) => {
        const params = new URLSearchParams(location.search);
        if (params.get('model')) {
            params.delete('model');

        }
        params.set('id', id);
        navigate({ search: params.toString() }, { replace: true });
    }

    const handleNewChat = () => {
        const params = new URLSearchParams(location.search);

        if (params.get('id')) {
            params.delete('id');

        }
        params.set('model', 'auto');
        navigate({ search: params.toString() }, { replace: true });
    }


    const elementReturnMobile = (element: any) => {
        return (
            <Drawer
                anchor={"left"}
                variant="permanent"
                PaperProps={{
                    sx: {
                        backgroundImage: "linear-gradient(to right bottom, #2D81C6, #2b82c5, #2b82c5, #3ea0c3, #4AB7C0)",
                        color: "white",
                        border: 0,
                        width: props.open ? drawerWidth : 0
                    }
                }}
                className={styles.bgSidebar}
                open={props.open}
            >
                {element}

            </Drawer>
        )
    }

    const elementReturnDesktop = (element: any) => {
        return (
            <DrawerDesktop
                variant="permanent"
                open={props.open}
                PaperProps={{
                    sx: {
                        background: "linear-gradient(100deg, hsl(206.1deg 64.17% 47.06%) 0%, hsl(206.1deg 64.17% 47.06%) 50%, hsl(185deg 88% 50%) 100%)",

                        color: "white",
                        border: 0,
                    }
                }}
                className={styles.bgSidebar}
            >
                {element}
            </DrawerDesktop>
        )
    }

    const elementList = () => {
        return (
            <>
                <DrawerHeader sx={{ ...(props.open ? { height: "175px" } : {}) }}>
                    {props.open && (
                        <div
                            style={{
                                // marginTop: 6,
                                // marginRight: 8,

                                minHeight: "100px",
                                height: "100%",
                                textAlign: "center"
                            }}
                        >
                            <img
                                // onClick={handleHome}
                                src={logo}
                                alt="..."
                                height={40}
                                style={{
                                    marginTop: "26px",
                                    textAlign: "center",
                                    width: "auto"
                                }}
                            />
                            <Typography variant="subtitle1" noWrap component="div" sx={{
                                fontSize: "12px",
                                fontWeight: 700,
                                lineHeight: "19.36px",
                                textAlign: "left",
                                // ระยะห่างแต่ละตัว css code

                                letterSpacing: "0.7px",



                            }}>
                                MSC Metro Systems Corporation
                            </Typography>
                            <Typography variant="subtitle1" sx={{ letterSpacing: "0.5px", color: "whitesmoke", fontSize: "8px" }}>
                                Watson Assistant - Knowledge Discovery
                            </Typography>
                        </div>
                    )}
                    <IconButton className={props.open ? styles.toggleSidebar : ""} onClick={props.handleToggle} data-testid="arrow-btn">
                        {props.open ? <ArrowBackIcon style={{ color: "white", fontSize: "20px" }} /> : <ArrowForwardIcon style={{ color: "white" }} />}
                    </IconButton>
                </DrawerHeader>

                <MenuItem sx={{ ...(props.open ? { marginTop: "0px", p: 1.7, mb: 0 } : { p: 0, m: 0 }) }}>
                    {props.open ? (
                        <>
                            {" "}
                            <Button
                                fullWidth
                                component="label"
                                role={undefined}
                                variant="contained"

                                // tabIndex={-1}
                                // MuiButton-startIcon style

                                // startIcon={<PostAddIcon />}
                                sx={{

                                    // button gradient css
                                    // background: "linear-gradient(45deg, #2682d0 30%, #87cc76 90%)",
                                    backgroundColor: "white",
                                    borderRadius: "6px",
                                    fontSize: "13px",
                                    color: "#2b82c5",
                                    minWidth: "0px",
                                    textAlign: "center",
                                    fontWeight: 600,
                                    // pt:"12px",
                                    '&:hover': {
                                        backgroundColor: "#f1f1f1",
                                        color: "#2b82c5"
                                    },
                                    ...(!props.open ? { ml: 0, mr: 0, mb: 0 } : { ml: 0, mr: 0, mb: 0 })
                                }}
                                onClick={handleNewChat}
                            >
                                {" "}
                                <PostAddIcon style={{ fontSize: "18px" }} />   <span className={stylesCss.newModelAuto} style={{ marginTop: "3px" }}>New Chat</span>

                            </Button>
                        </>
                    ) : (
                        <Button
                            fullWidth
                            component="label"
                            role={undefined}
                            variant="contained"
                            // tabIndex={-1}
                            // MuiButton-startIcon style

                            // startIcon={<PostAddIcon style={{ margin: "1px" }} />}
                            sx={{

                                // button gradient css
                                // background: "linear-gradient(45deg, #2682d0 30%, #87cc76 90%)",
                                backgroundColor: "white",
                                fontSize: "12px",
                                color: "#2b82c5",
                                minWidth: "0px",
                                textAlign: "center",
                                ...(!props.open ? { ml: 1, mr: 1, mb: 2 } : { ml: 0, mr: 0, mb: 0 })
                            }}
                        >
                            <PostAddIcon style={{ margin: "1px" }} />
                        </Button>
                    )}
                </MenuItem>

                <List sx={{ width: "100%", mt: -1, pt: 0, pb: 0, mb: 0 }}>
                    <ListItem alignItems="flex-start" sx={{ mt: 0, pt: 0, pb: 0, mb: 0, ...(!props.open && { textAlign: "center" }) }}>
                        <ListItemAvatar sx={{ width: "25px", minWidth: "10px" }}>
                            <HistoryIcon sx={{ color: "white", fontSize: "18px" }} />
                        </ListItemAvatar>
                        {props.open && (
                            <ListItemText
                                primary="Activity"
                                primaryTypographyProps={{ marginTop: "5px", fontSize: "12px", fontWeight: 100, color: "white", style: { whiteSpace: "pre-wrap" } }}
                            />
                        )}
                    </ListItem>
                </List>

                {props.open && (
                    <List
                        sx={{
                            height: "calc(100% - 100px)",
                            overflowY: "auto",
                            overflowX: "hidden", // Disable horizontal scrolling
                            "&::-webkit-scrollbar": {
                                width: "2px",
                                backgroundColor: "rgba(255, 255, 255, 0.1)"
                            },
                            p: 1.5
                        }}
                    >
                        {visibleItems.sort((a: any, b: any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()).map((item: any, index: number) => {

                            return (
                                <ListItem
                                    key={item.id}
                                    secondaryAction={
                                        <>
                                            <IconButton edge="end" aria-label="more" onClick={(event) => handleClickMenu(event, item.id)}>
                                                <MoreVertIcon sx={{ color: "#fffafa5e", fontSize: "20px" }} />

                                            </IconButton>
                                            <Menu
                                                id={index.toString()}
                                                anchorEl={menuAnchorEl[item.id]}
                                                keepMounted
                                                open={Boolean(menuAnchorEl[item.id])}
                                                onClose={() => handleCloseMenu(item.id)}
                                            >
                                                <MenuItem onClick={() => handleDelete(item.id)} ><MdOutlineAutoDelete style={{ marginRight: "10px", color: "red", fontSize: "18px" }} /> Delete</MenuItem>
                                                <MenuItem onClick={() => handleShowEditHistoryName(item.id, item.title)} ><MdEditDocument style={{ marginRight: "10px", color: "#bfbf00", fontSize: "18px" }} /> Edit</MenuItem>

                                            </Menu>
                                        </>
                                    }
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px", marginBottom: "10px" }}

                                >
                                    {/* set text w */}
                                    <Box sx={{ width: "100%", cursor: "pointer" }} onClick={() => handleHistoryById(item.id)}>
                                        <ListItemText
                                            primary={item.title}
                                            primaryTypographyProps={{ fontSize: "11px ", color: "white", lineHeight: "1.2em", style: { whiteSpace: "pre-wrap" } }}
                                        />
                                        <Typography variant="subtitle2" sx={{
                                            color: "rgb(255 255 255 / 70%)",
                                            fontFamily: "IBM Plex Sans Thai",
                                            fontSize: "8px",
                                            fontWeight: "400",
                                            lineHeight: "20px",
                                            textAlign: "left",

                                        }}>
                                            {formatDuration(item.date)}
                                        </Typography>
                                    </Box>
                                </ListItem>

                            )
                        })
                        }

                        {loading &&
                            <Stack spacing={1}>

                                <Skeleton variant="rectangular" width={210} height={55} sx={{ borderRadius: "8px" }} />
                                <Skeleton variant="rounded" width={210} height={55} sx={{ borderRadius: "8px" }} />
                                <Skeleton variant="rounded" width={210} height={55} sx={{ borderRadius: "8px" }} />
                            </Stack>
                        }




                    </List>
                )}
                {/* set footer sidebar set fix to bottom */}
                <Box sx={{ flexGrow: 1 }} />
                {/* Divide ให้มีสี เส้นใหญ่ขึ้น*/}
                <Divider sx={{ color: "white", fontSize: "4px", borderTop: "0.1px solid #87d4eb" }} />

                <List>
                    <ListItem disablePadding sx={{ display: "block", mb: 0, p: 0 }}>
                        <ListItemButton
                            sx={{
                                // minHeight: 48,
                                justifyContent: props.open ? "initial" : "center",
                                ...(!props.open ? { px: 2 } : { p: "0px 0px 0px 16px" }),
                                marginBottom: "0px"
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: props.open ? "1px" : "1px",
                                    justifyContent: "center"
                                }}
                            >
                                <RefreshIcon style={{ color: "white", fontSize: "20px" }} />
                            </ListItemIcon>
                            {props.open && (
                                <ListItemText
                                    primary={"Clear Conversations"}
                                    primaryTypographyProps={{ fontSize: "12px !important", fontWeight: 100, color: "white", ml: 1, mt: "2px" }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block", mt: 0 }}>
                        <ListItemButton
                            sx={{
                                // minHeight: 48,
                                justifyContent: props.open ? "initial" : "center",
                                // px: 2,
                                ...(!props.open ? { px: 2 } : { p: "0px 0px 0px 16px" }),
                                mt: 0,
                                marginBottom: "0px"
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: props.open ? "1px" : "1px",
                                    justifyContent: "center"
                                }}
                            >
                                <DisplaySettingsIcon style={{ color: "white", fontSize: "20px" }} />
                            </ListItemIcon>
                            {props.open && <ListItemText primary={"Setting"} primaryTypographyProps={{ fontSize: "12px", fontWeight: 100, color: "white", ml: 1 }} />}
                        </ListItemButton>
                    </ListItem>

                    <ListItem
                        secondaryAction={
                            props.open && (
                                <>
                                    <IconButton edge="end" aria-label="delete" onClick={handleClick}>
                                        <MoreVertIcon sx={{ color: "#fffafa5e", fontSize: "20px", fontWeight: 300 }} />
                                    </IconButton>
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </>
                            )
                        }
                        style={{ marginBottom: "10px" }}
                    >
                        <ListItemAvatar sx={{ mr: "10px", ...(!props.open ? { ml: "4px" } : {}), pl: "0px", minWidth: "0px" }}>
                            <Avatar sx={{ width: "25px", height: "25px", m: 0, p: 0 }} alt="Travis Howard" src="https://mui.com/static/images/avatar/2.jpg" />
                        </ListItemAvatar>
                        {/* set text w */}
                        {props.open && (
                            <Box sx={{ width: "100%" }}>
                                <ListItemText
                                    primary={localStorage.getItem("username") || "MekaV Assistant"}
                                    primaryTypographyProps={{ fontSize: "14px ", color: "white", fontWeight: 100, ml: "0px", style: { whiteSpace: "pre-wrap" } }}
                                />
                            </Box>
                        )}
                    </ListItem>
                </List>

                <DialogRenameComponent open={open} setOpen={setOpen} setName={setEditHistoryName} name={editHistoryName || ['', '']} handleUpdateHistoryName={handleUpdateHistoryName} />
            </>
        )
    }

    const elementReturn = (element: any) => {
        return props.isSmallScreen ? elementReturnMobile(element) : elementReturnDesktop(element)
    }



    return (
        elementReturn(elementList())
    )

}

export default Sidebar