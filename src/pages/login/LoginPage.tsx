import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
} from "@mui/material";

import logo from "../../static/images/logo.png";
import ad_login from "../../static/images/ad.png";
import ad_login_b2c from "../../static/images/azure-ad-b2c.png";
import userData from "../../role.json";
import subjectData from "../../access.json";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { loginRequest, msalConfig } from "../../auth/authConfig";
import bglogin from "../../static/images/bglogin.png";

import { Theme, fontSize, useMediaQuery } from "@mui/system";
import styled from "styled-components";
import { frontenSecrets } from "../../api";
import { Secret } from "../../app-types/secret.type";
import LoadingSpinner from "../../components/Spinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const FloatingImg = styled.img`
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
  border-radius: 0 10px 10px 0;
`;

const useCustomHook = () => {
  useMsalAuthentication(InteractionType.Redirect);
};

const LoginPage: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [isLoadingPage, setIsLoadingPage] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [secret, setSecret] = React.useState<Secret | null>(null);

  const [isLogin, setIsLogin] = React.useState(false);

  // const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isSmallScreen = false;
  const accounts: any = useMsal().accounts;

  // useMsalAuthentication(InteractionType.Redirect);

  const handleLogin = async () => {
    instance.logoutRedirect();
    // instance.loginRedirect(loginRequest).then((response) => {
    //   console.log("🚀 ~ handleLogin ~ response", response)
    // }).catch((error) => {
    //   console.log("🚀 ~ handleLogin ~ error", error)
    // })
    // const loginResponse:any = await instance.loginRedirect({
    //   scopes: ['openid', 'profile', 'user.read'],
    //   prompt: 'select_account', // ใช้ prompt 'select_account' เพื่อให้มั่นใจว่าผู้ใช้เลือกบัญชีใหม่ทุกครั้งที่เข้าสู่ระบบ
    // });
    // console.log('Login Response:', loginResponse);
    // if (loginResponse) {

    //   localStorage.setItem("idToken", loginResponse.idToken);
    //   localStorage.setItem("accessToken", loginResponse.accessToken);

    //     localStorage.setItem("homeAccountId", loginResponse.account.homeAccountId);
    //     localStorage.setItem("environment", loginResponse.account.environment);
    //     localStorage.setItem("tenantId", loginResponse.account.tenantId);
    //     localStorage.setItem("username", loginResponse.account.username);
    //     localStorage.setItem("localAccountId", loginResponse.account.localAccountId);
    //     localStorage.setItem("name", loginResponse.account.name);

    //     localStorage.setItem("authorityType", loginResponse.account.authorityType);
    //     localStorage.setItem("idTokenClaims", JSON.stringify(loginResponse.account.idTokenClaims));
    //     localStorage.setItem("authorityType", loginResponse.account.authorityType);
    //     localStorage.setItem("idToken", loginResponse.account.idToken);
    //     localStorage.setItem("accessToken", loginResponse.account.accessToken);
    //      navigate('/')

    // }
  };

  const handleSecretLogin = async () => {
    try {
      setIsLoadingPage(true);
      const resp: Secret | null = (await frontenSecrets()) as Secret | null;

      setSecret(resp);
    } catch (error) {}
  };

  const checkLogin = () => {
    if (localStorage.getItem("idToken")) {
      navigate("/");
    }

    if (accounts.length > 0) {
      localStorage.setItem("username", accounts[0].username);
      localStorage.setItem("tenantId", accounts[0].tenantId);
      localStorage.setItem("username", accounts[0].username);
      localStorage.setItem("localAccountId", accounts[0].localAccountId);
      localStorage.setItem("name", accounts[0].name);
      localStorage.setItem("idToken", accounts[0].idToken);
      localStorage.setItem("authorityType", accounts[0].authorityType);
      localStorage.setItem(
        "idTokenClaims",
        JSON.stringify(accounts[0].idTokenClaims)
      );
      localStorage.setItem("authorityType", accounts[0].authorityType);

      navigate("/");
    }
  };

  React.useEffect(() => {
    handleSecretLogin();

    checkLogin();
  }, []);

  // React.useEffect(() => {
  //   if(isLogin){
  //     useMsalAuthentication(InteractionType.Redirect);

  //     const { accounts } = useMsal();
  //     console.log("🚀 ~ App ~ accounts:", accounts);
  //   }

  // }, [isLogin])

  return isLoadingPage && !secret ? (
    <div data-testid="login-screen-loading">
      <LoadingSpinner height={100} />
    </div>
  ) : (
    <div
      style={{
        backgroundImage: `linear-gradient(to right bottom, rgb(45 129 198 / 72%), rgb(43, 130, 197), rgb(43 130 197), rgb(62 160 195 / 0%), rgb(74, 183, 192)), url(${bglogin})`,
        objectFit: "cover",
        // ใส่สีพื้นหลัง lenear-gradient(to right bottom, #2D81C6, #2b82c5, #2b82c5, #3ea0c3, #4AB7C0)
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            //backgroundImage: "linear-gradient(to right bottom, #2D81C6, #2b82c5, #2b82c5, #3ea0c3, #4AB7C0)",
            color: "#00695f",
            border: 0,
            backgroundColor: "white",
            // padding: 4,
            borderRadius: 3,
            // boxShadow: 3,
            textAlign: "center",
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 60px 40px -7px",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={{ xs: 0, md: 0 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid
                item
                xs={4}
                sm={4}
                md={7}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ p: 5 }}
              >
                {/* <img
                            // onClick={handleHome}
                            src={logo}
                            alt="..."
                            height={50}
                            style={{
                                marginTop: "20px",
                                textAlign: "center",
                                width: "auto",
                                marginBottom: "20px",
                            }}
                        /> */}

                <Box
                  sx={{
                    textAlign: "center",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
                    WELCOME TO
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{ fontWeight: "bold", mb: 4, color: "#272362" }}
                  >
                    MSC Metro Systems Corporation
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, textAlign: "left" }}
                  >
                    Sign in with your organizational account
                  </Typography>
                  {secret && (
                    <>
                      <Button
                        fullWidth
                        sx={{
                          width: "100%",
                          backgroundColor: "#0d47a1",
                          color: "white",
                          fontWeight: 900,
                          p: isSmallScreen ? "0.5rem" : 1,
                          fontSize: isSmallScreen ? "1ุ4px" : "20px",
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#2D81C6",
                            color: "white",
                          },
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                        }}
                        // onClick={handleLogin}
                        onClick={() => instance.loginRedirect()}
                      >
                        <img
                          src={ad_login}
                          alt=""
                          width={25}
                          style={{ marginRight: "10px" }}
                        />{" "}
                        LOGIN MSC FOR AD
                      </Button>

                      {/* <Button
                        fullWidth
                        sx={{
                          width: "100%",
                          backgroundColor: "#0d47a1",
                          color: "white",
                          mt: 2,
                          fontWeight: 900,
                          p: isSmallScreen ? "0.5rem" : 1,
                          fontSize: isSmallScreen ? "1ุ4px" : "20px",
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#2D81C6",
                            color: "white",
                          },
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                        }}
                        // onClick={handleLogin}
                        onClick={() => instance.loginRedirect()}
                      >
                        <img
                          src={ad_login_b2c}
                          alt=""
                          width={25}
                          style={{ marginRight: "10px" }}
                        />{" "}
                        LOGIN PTTDIGITAL FOR B2C
                      </Button> */}
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item xs={4} sm={4} md={5} sx={{ p: 0, m: 0 }}>
                <FloatingImg
                  src="https://www.metrosystems.co.th/wp-content/uploads/2020/06/careerNew_n-e1591331825904.png"
                  alt="MSC Logo"
                  style={{ width: "100%", height: "100%" }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default LoginPage;
