import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "../../components/Layouts/Sidebar/Sidebar";
import Header from "../../components/Layouts/Header/Header";
import HeaderMobile from "../../components/Layouts/HeaderMobile/HeaderMobile";
import { useMediaQuery } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";

const drawerWidth = 230;

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

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

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

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: prop => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== "open" })(({ theme, open }) => ({
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

export default function LayoutLatest(props:any) {
    // const isSmallScreen = useMediaQuery((theme:Theme) => theme.breakpoints.down('sm'));
    const isSmallScreen = false
    const [open, setOpen] = React.useState(true);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: "flex", background: "#f0f8fb" }}>
            <CssBaseline />
           {isSmallScreen && 
                <HeaderMobile handleToggle={handleToggle}/>
           } 
            <Sidebar open={open} handleToggle={handleToggle} isSmallScreen={false}/>
            <Box component="main" sx={{ flexGrow: 1, p: 3 ,height:"100vh"}}>
            {isSmallScreen &&   <DrawerHeader /> }
               <Header />
                {props.children}
            </Box>
        </Box>
    );
}
