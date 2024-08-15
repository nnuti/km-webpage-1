import { Grid, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { GoDotFill } from 'react-icons/go';
import styles from './Content.module.css';

// import "@fontsource/prompt"; // Defaults to weight 400
import "@fontsource/prompt/400.css"; // Specify weight
import "@fontsource/prompt/400-italic.css"; // Specify weight and style
import { TimePeriodComponent } from '../../../utills';




function Content() {

  const [text, setText] = useState('');

  const full = 'ส';


  useEffect(() => {

    // const tenants = import.meta.env;

    // console.log('Tenants:', tenants);

      let i = '';
      const fullText = 'สวัสดี'+ TimePeriodComponent() +' คุณ ' + localStorage.getItem('name');
  
      const typeText = async () => {
          for (let index = 0; index < fullText.length; index++) {
              i += fullText.charAt(index);
              await new Promise(resolve => setTimeout(resolve, 50));
              setText(i);
          }
      };
  
      typeText();
  }, []);
  return (
    <Box
    sx={{
      display: "flex",
      justifyContent: "start",
      // p: 1,
      // m: 1,

      borderRadius: 1
    }}
  >
    <Grid sx={{ marginTop: "0px" }}>
      {/* ทำให้ตัวหนังสือ วิ่งได้ */}
      <Typography variant="h1" className={styles.chatStartText} style={{fontFamily:"Prompt"}}>
        {text ? text : full}
      </Typography>
      {/* <Typography variant="h1" className={styles.chatStartText} sx={{textAlign:"left"}}>
                                    สวัสดีคุณตอนบ่าย Metro Lee
                                </Typography> */}

      <Stack direction="row" spacing={2}>
        <Grid>
          {" "}
          <Typography variant="h1" className={styles.chatStartTextUnder} style={{fontFamily:"Prompt"}}>
            มีอะไรให้ฉันช่วยบ้าง ?
          </Typography>
        </Grid>
        <Grid>
          {" "}
          <div className={styles.iconDot}>
            {" "}
            <span className={styles.dotLeft}>
              <GoDotFill style={{fontSize:"10px"}} />{" "}
            </span>{" "}
            <span className={styles.dotRight}>
              <GoDotFill  style={{fontSize:"10px"}} />{" "}
            </span>
          </div>
        </Grid>
      </Stack>
      <Typography variant="subtitle1" className={styles.suggest}>
        ป้อนคำถามที่คุณอยากทราบ หรือ เลือกตัวอย่างคำถามด้านล่าง
      </Typography>
    </Grid>
  </Box>
  )
}

export default Content