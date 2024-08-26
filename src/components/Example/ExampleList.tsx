import React from "react";
import { Box, Grid, Slide, Typography } from "@mui/material";
import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
    icon: string;
    textFooter: string;
    color?: string;
};

const EXAMPLES: ExampleModel[] = [
    /*{
        text: "What is included in my Northwind Health Plus plan that is not in standard?",
        value: "What is included in my Northwind Health Plus plan that is not in standard?"
    },
    { text: "What happens in a performance review?", value: "What happens in a performance review?" },
    { text: "What does a Product Manager do?", value: "What does a Product Manager do?" }*/
    { text: "เข้าระบบประกันสังคม ต้องทำยังไง", value: "เข้าระบบประกันสังคม ต้องทำยังไง",icon:"GrDocumentCloud",textFooter:"HR Center",
  color:"#2683D0"
},
    { text: "Annual Leave Policy", value: "Annual Leave Policy",icon:"",textFooter:"Finance & Tax" }
    
];

const EXAMPLES_SUG: ExampleModel[] = [
    { text: "กรณีแต่งงานได้เงินสบทบเท่าไหร่", value: "กรณีแต่งงานได้เงินสบทบเท่าไหร่",icon:"",textFooter:"Event and exhibition" },
    { text: "วันลาทั้งหมดของ 1 ปี", value: "วันลาทั้งหมดของ 1 ปี",icon:"",textFooter:"Annual Reports" }
    
];

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
    return (
        <>
            <Box sx={{ flexGrow: 1,marginTop:"58px",ml:-3,mr:-3 }}>
                <Grid container spacing={{ xs: 0, md: 0 }} columns={{ xs: 4, sm: 8, md: 12 }} alignItems="stretch">
                    <Grid item xs={4} sm={8} md={6} sx={{borderRight:"1px solid white",p:2,m:0}}>
                        <Grid>
                            <Slide 
                             direction={"right"}
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
                            <Typography variant="inherit" className={styles.trending}>
                                Trending
                            </Typography>
                            </Slide>
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={{ xs: 1.5, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                    {EXAMPLES.map((x, i) => (
                                        <Grid key={i} item xs={4} sm={4} md={6}>
                                            <Grid>
                                                <Example index={i} text={x.text} value={x.value} textFooter={x.textFooter} color={x.color} icon={x.icon} onClick={onExampleClicked} />
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} sm={8} md={6} sx={{m:0,p:2}}>
                        <Grid>
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
                        <Typography variant="inherit" className={styles.trendsuggest}>
                                Suggest for you
                            </Typography>
                            </Slide>
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={1.5}>
                                    {EXAMPLES_SUG.map((x, i) => (
                                        <Grid key={i} item xs={12} sm={6} md={6}>
                                            
                                                <Example index={i} text={x.text} value={x.value} textFooter={x.textFooter} icon={x.icon} onClick={onExampleClicked} />
                                            
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
    
        </>
  
    );
};
