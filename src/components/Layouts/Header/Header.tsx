import React from 'react';
import { Button, Grid, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useNavigate, useLocation } from 'react-router-dom'
// import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/inter/400.css"; // Specify weight
import { useAppDispatch, useAppSelector } from '../../../redux-toolkit/hooks';
import { selectHistoryState } from '../../../redux-toolkit/History/history-slice';
import { getCurrentHistoryThunk } from '../../../redux-toolkit/History/history-thunk';

function Header() {

  const navigate = useNavigate()
  const location = useLocation()
   //redux
   const dispatch = useAppDispatch();
   const { toggle } = useAppSelector(selectHistoryState);

   const handleRouter = (path: string) => {
    dispatch(getCurrentHistoryThunk(!toggle));
     navigate(path)

   }


  return (
    <div style={{ width: "100%" }}>
      <Box sx={{ display: "flex", p: 1, borderRadius: 1, justifyContent: "center" }}>

        <Grid>
          {/* boxShadow generate */}

          <Stack direction="row" spacing={1} sx={{ borderRadius: "50px", backgroundColor: "white", p: "4px 8px 4px 8px", boxShadow: "0px 4px 8px rgb(0 0 0 / 6%)" }}>
            <Grid>
              <Button
                variant="contained"
                size="small"
                style={{
                  whiteSpace: "nowrap", borderRadius: "50px", fontSize: "12px",fontWeight: 500,lineHeight:"1.3rem",
                  fontFamily:"Inter",
                  ...location.pathname === "/" ? { background: "linear-gradient(90.19deg, #4573CB 0%, #3DC7DB 100.99%, #5F984E 101%)",color:"rgba(255, 255, 255, 1)" } : {
                    background: "white",
                    boxShadow: "0px 0px 0px 0px", color: "black"
                  },
                }}
                onClick={() => handleRouter("/")}
              >
                Internal Data
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                size="small"
                style={{
                  whiteSpace: "nowrap", borderRadius: "50px", fontSize: "13px",fontWeight: 500,lineHeight:"1.2rem",
                  fontFamily:"Inter",
                  ...location.pathname === "/external" ? { background: "linear-gradient(90.19deg, #4573CB 0%, #3DC7DB 100.99%, #5F984E 101%)",color:"rgba(255, 255, 255, 1)" } : {
                    background: "white",
                    boxShadow: "0px 0px 0px 0px", color: "black"
                  },

                }}
                onClick={() => handleRouter("/external")}
              >
                External Data
              </Button>
            </Grid>
          </Stack>
        </Grid>
      </Box>

  
    </div>
  )
}

export default Header