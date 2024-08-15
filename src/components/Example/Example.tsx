import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Slide } from "@mui/material";
import { GrDocumentCloud } from "react-icons/gr";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
    })
}));
// import { Box, Grid } from "@mui/material";
// import styles from "./Example.module.css";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
interface Props {
    index: number;
    text: string;
    value: string;
    textFooter: string;
    icon: string;
    color?: string;
    onClick: (value: string) => void;
}

export const Example = ({ index, text, textFooter, icon, value,color, onClick }: Props) => {
    const [expanded, setExpanded] = React.useState(false);
    
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <Slide
            direction={"left"}
            in={true}
            mountOnEnter
            unmountOnExit
            timeout={{
                enter: 700,  // Increase the duration for entering
                exit: 300,   // Increase the duration for exiting if necessary
            }}
            easing={{
                enter: 'ease-out',  // Customize the easing function
                exit: 'ease-in',    // Customize the easing function
            }}
        >
            <Card sx={{ boxShadow: "0px 4px 8px 0px rgba(169, 169, 169, 0.1)", p: 0, height: "100%",borderRadius:"10px" }}
                onClick={() => onClick(value)}
                data-testid="card-media-svg"
            >

                <CardContent sx={{pb:0,height: "80px",pt:"16px",pr:"14px",pl:"14px"}}>
                    <Typography variant="body2"  sx={{ textAlign: "left", lineHeight: "1.2rem !important", fontSize: "12px", ...color ? { color: color,fontWeight:600 } : {fontWeight:500, color: "rgba(88, 88, 90, 1)" } }}>
                        {/* show text ไม่เกิน 150 ตัวอักษร */}
                        {text.length > 100 ? text.substring(0, 100) + "..." :
                            text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ p: 0, m: 0 }}>
                    <IconButton aria-label="add to favorites" sx={{ paddingLeft: 2 }}>
                        <GrDocumentCloud style={{ fontSize: "12px", ...color ? { color: color } : { color: "#0000004f" } }} />
                    </IconButton>
                    <span style={{ fontSize: "10px", ...color ? { color: color ,fontWeight:600} : { color: "#0000004f",fontWeight:500 } }} >
                        {textFooter}
                    </span>
                    <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more" sx={{p:0}}>
                        <ArrowUpwardIcon sx={{ fontSize: "20px", m: 1,p:"5px", color: "#0000004f", backgroundColor: "#e5e5e575", borderRadius: "50%" }} />
                    </ExpandMore>
                </CardActions>

            </Card>
        </Slide>
       
    );
};
