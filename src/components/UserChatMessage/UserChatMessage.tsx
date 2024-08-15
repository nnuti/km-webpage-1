import { Avatar, Box, Grid, ListItemAvatar } from "@mui/material";
import styles from "./UserChatMessage.module.css";
import { formatDuration } from "../../utills";

import React from "react";
import { AskResponse } from "../../api/indextwo";
import { ChatMessage } from "../../api";


interface Props {
    message: string;
    index: number;
    answer: ChatMessage
}

export const UserChatMessage: React.FC<Props> = ({ message, index, answer }) => {

    
    return (

        <div key={index} style={{ width: '100%' }}>
            <Box
                sx={{ display: 'flex', p: 1 }}
            >
                <Grid sx={{ flexShrink: 1 }}>
                    <ListItemAvatar sx={{ mr: "10px", pl: "0px", minWidth: "0px" }}>
                        <Avatar sx={{ width: "25px", height: "25px", m: 0, p: 0 }} alt="Travis Howard" src="https://mui.com/static/images/avatar/2.jpg" />
                    </ListItemAvatar>
                </Grid>
                <Grid sx={{ width: '100%' ,textAlign:"left"}}>
                  <span style={{color:"rgba(93, 92, 92, 1)"}}>{localStorage.getItem("name")} </span> <span style={{color:"#A1A1A1",fontSize:"10px"}}>
                  {formatDuration(answer?.date)}
                  </span>

                    <div className={styles.container}>
                        <div className={styles.message}>
                       {/* { props.message?[0]} */}
                       {answer.content}
                        </div>
                    </div>
                </Grid>


            </Box>
        </div>
    );
};
