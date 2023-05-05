import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import logo from "../assets/images/logo.png";
import "./Home.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import company1 from "../assets/images/zomato.webp";
import company2 from "../assets/images/byjus.webp";
import company3 from "../assets/images/burger.webp";
import company4 from "../assets/images/paytm.png";
import users from "../assets/images/users.jpg";
import jobs from "../assets/images/jobs.jpg";
import { NavBar } from "../components/NavBar";
import { Link } from "react-router-dom";
import Login from "./Login";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export function HomePage(props) {
  const signupButtonHandler = () => {};

  return (
    <>
      <NavBar />
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={2}
          className="homepage-first-container"
          alignItems="center"
        >
          {/* first container - left part */}
          <Grid item xs={4} className="no-border">
            <div>
              <img src={logo} width="175" height="175"></img>
            </div>
          </Grid>

          {/* first container - right part */}
          <Grid item xs={8}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Link to="/listings">
                  <Button
                    variant="outlined"
                    color="success"
                    style={{
                      textTransform: "none",
                      width: "12.5rem",
                      borderColor: "#2bb792",
                      borderWidth: "2px",
                    }}
                    sx={{
                      "&:hover": {
                        bgcolor: "#2bb792",
                        color: "white",
                      },
                    }}
                  >
                    Job Listings
                  </Button>
                </Link>
              </Grid>

              <Grid item>
                <Link to="/signup">
                  <Button
                    variant="outlined"
                    color="success"
                    style={{
                      textTransform: "none",
                      width: "12.5rem",
                      borderColor: "#2bb792",
                      borderWidth: "2px",
                    }}
                    sx={{
                      "&:hover": {
                        bgcolor: "#2bb792",
                        color: "white",
                      },
                    }}
                  >
                    Jobseeker Sign Up
                  </Button>
                </Link>
              </Grid>

              {/* </Grid> */}
            </Grid>
          </Grid>
          {/* <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid> */}
        </Grid>

        <Grid
          container
          spacing={2}
          className="homepage-second-container"
          alignItems="center"
        >
          {/* second container - left part  */}
          <Grid item xs={6}>
            <div>
              <h1 className="second-container-title">
                Hire from pool of{" "}
                <span className="second-container-span">Top Talents</span>
              </h1>
              {/* <h1>Best candidates reach out to you directly</h1> */}
            </div>
          </Grid>

          {/* second container - right part  */}
          {/* <Grid item xs={4}>
            <div>
              <Grid
                container
                direction="column"
                spacing={2}
                className="homepage-login-box"
              >
                <Grid item>
                  <Typography className="jobseeker-login-font">
                    Jobseeker login
                  </Typography>
                  <TextField
                    label="Username"
                    variant="outlined"
                    size="small"
                    // className={classes.textField}
                    // value={username}
                    // onChange={handleUsernameChange}
                    InputLabelProps={{ style: { fontSize: 13 } }}
                    style={{
                      width: "12.5rem",
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Password"
                    variant="outlined"
                    // className={classes.textField}
                    type="password"
                    size="small"
                    InputLabelProps={{ style: { fontSize: 13 } }}
                    // value={password}
                    // onChange={handlePasswordChange}
                    style={{
                      width: "12.5rem",
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="success"
                    style={{
                      textTransform: "none",
                      width: "12.5rem",
                      borderColor: "#2bb792",
                      borderWidth: "2px",
                      backgroundColor: "#2bb792",
                      color: "white",
                    }}
                  >
                    Login →
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid> */}

          <Login/>

        </Grid>

        {/* third container   */}
        <Grid item xs={12}>
          <div className="third-container-sentence">
            <p>4,00,000+ Top Companies Trust 7th Pillar Jobs</p>
            {/* <h1>Best candidates reach out to you directly</h1> */}
          </div>
        </Grid>

        {/* fourth container   */}
        <Grid
          container
          spacing={2}
          className="homepage-fourth-container"
          alignItems="center"
        >
          <Grid item xs={1.5}>
            <img src={company1} className="company-logos"></img>
          </Grid>

          <Grid item xs={1.5}>
            <img src={company2} className="company-logos"></img>
          </Grid>

          <Grid item xs={1.5}>
            <img src={company3} className="company-logos"></img>
          </Grid>

          <Grid item xs={1.5}>
            <img src={company4} className="company-logos"></img>
          </Grid>

          <Grid item xs={3} className="homepage-grid-border">
            <img src={users} className="users-jobs-logos"></img>
            <h4 className="users-jobs-font">
              3 Crore+ <span className="users-jobs-span">users</span>
            </h4>
          </Grid>
          <Grid item xs={3}>
            <img src={jobs} className="users-jobs-logos"></img>

            <h4 className="users-jobs-font">
              {" "}
              50 Lakhs+ <span className="users-jobs-span">jobs</span>
            </h4>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
